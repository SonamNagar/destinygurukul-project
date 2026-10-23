
import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  X,
  Lock,
  Printer,
  Sparkles,
  LoaderCircle,
  Receipt,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

const RAZORPAY_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

// Load Razorpay Checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Script already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });

      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const amount = Number(
    booking?.amount || booking?.tutor?.fees || 500
  );

  const tutorName =
    booking?.tutor?.name ||
    booking?.tutor?.fullName ||
    "Your Tutor";

  const studentName =
    booking?.studentName ||
    booking?.student?.name ||
    "Student";

  const handlePayment = async () => {
    if (loading || paymentSuccess) return;

    setLoading(true);

    try {
      // 1. Load Razorpay Checkout
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout load nahi hua. Internet connection check karein."
        );
      }

      // 2. Ask backend to create a real Razorpay order
      const orderResponse = await api.post(
        "/payments/create-order",
        {
          bookingId: booking._id,
        }
      );

      const orderData = orderResponse.data?.data || orderResponse.data;

      const orderId = orderData?.orderId;
      const keyId =
        orderData?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!orderId || !keyId) {
        throw new Error(
          "Payment order ya Razorpay Key ID nahi mili. Backend response check karein."
        );
      }

      // Simulated orders must never be used for real payment.
      if (orderData?.isSimulated) {
        throw new Error(
          "Backend simulated order return kar raha hai. Real Razorpay credentials aur backend configuration check karein."
        );
      }

      // 3. Open official Razorpay Checkout
      const options = {
        key: keyId,
        order_id: orderId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Destiny Gurukul",
        description: "Tutor Booking Payment",
        image: "/favicon.ico",

        prefill: {
          name: studentName,
          email:
            booking?.studentEmail ||
            booking?.student?.email ||
            "",
          contact:
            booking?.studentPhone ||
            booking?.student?.phone ||
            "",
        },

        notes: {
          bookingId: booking._id,
          tutorName,
        },

        theme: {
          color: "#7C3AED",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        // Razorpay returns these details after checkout.
        // Backend must verify the signature before marking paid.
        handler: async (response) => {
          try {
            const verificationResponse = await api.post(
              "/payments/verify",
              {
                bookingId: booking._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            const verificationData =
              verificationResponse.data?.data ||
              verificationResponse.data;

            if (
              verificationResponse.data?.success === false ||
              verificationData?.verified === false
            ) {
              throw new Error(
                verificationResponse.data?.message ||
                  "Payment verification failed."
              );
            }

            // Only show success after backend verification responds.
            setReceiptData({
              receiptId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount,
              currency: orderData.currency || "INR",
              date: new Date().toLocaleString("en-IN"),
              studentName,
              tutorName,
              bookingId: booking._id,
            });

            setPaymentSuccess(true);
            toast.success("Payment verified successfully!");

            // Refresh the booking list.
            if (onSuccess) {
              onSuccess();
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error
            );

            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error(
          "Razorpay payment failed:",
          response.error
        );

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment initialization error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Prevent rendering without a booking.
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-violet-900/70 via-slate-950 to-slate-950 px-6 py-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/15">
                {paymentSuccess ? (
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                ) : (
                  <CreditCard className="h-6 w-6 text-violet-300" />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {paymentSuccess
                    ? "Payment Successful"
                    : "Secure Checkout"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {paymentSuccess
                    ? "Your payment has been verified"
                    : "Destiny Gurukul · Tutor Booking"}
                </p>
              </div>
            </div>

            {!paymentSuccess && (
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Close payment window"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">

          {/* Payment receipt */}
          {paymentSuccess && receiptData ? (
            <div id="payment-receipt">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
                  <CheckCircle className="h-11 w-11 text-emerald-400" />
                </div>

                <div className="mb-2 flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    Payment Verified
                  </span>
                </div>

                <h3 className="text-4xl font-extrabold tracking-tight">
                  ₹{receiptData.amount.toLocaleString("en-IN")}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Your booking payment was successful.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-violet-400" />
                  <h3 className="font-bold">Payment Receipt</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Receipt ID</span>
                    <span className="max-w-[60%] break-all text-right font-medium">
                      {receiptData.receiptId}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Booking ID</span>
                    <span className="max-w-[60%] break-all text-right font-medium">
                      {receiptData.bookingId}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Student</span>
                    <span className="text-right font-medium">
                      {receiptData.studentName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Tutor</span>
                    <span className="text-right font-medium">
                      {receiptData.tutorName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Date</span>
                    <span className="text-right font-medium">
                      {receiptData.date}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Status</span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-400">
                      Verified
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between gap-4">
                      <span className="font-semibold">Total Paid</span>
                      <span className="text-lg font-extrabold text-emerald-400">
                        ₹{receiptData.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold transition hover:bg-white/10"
                >
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-bold transition hover:bg-violet-500"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Booking details */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15">
                    <GraduationCap className="h-6 w-6 text-violet-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Tutor
                    </p>
                    <h3 className="mt-1 truncate font-bold">
                      {tutorName}
                    </h3>
                  </div>

                  <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-400">
                      Total Amount
                    </span>

                    <span className="text-3xl font-extrabold">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Final amount is determined and validated by the
                    backend.
                  </p>
                </div>
              </div>

              {/* Secure checkout information */}
              <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      Secure Razorpay Payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Pay securely using UPI, debit card, credit card
                      or net banking through Razorpay Checkout. Your
                      card details are not collected by this form.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 font-bold shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay ₹{amount.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure checkout · Server-side verification
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Please do not close this window while payment
                verification is in progress.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Print only the receipt */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #payment-receipt,
            #payment-receipt * {
              visibility: visible !important;
            }

            #payment-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              color: #111827 !important;
              background: white !important;
              padding: 24px;
            }

            #payment-receipt button {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentModal;


import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle,
  X,
  Lock,

  Printer,
  Sparkles,

} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("upi"); // 'upi' | 'card' | 'netbanking'
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Form states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("SBI");

  const amount = booking?.amount || booking?.tutor?.fees || 500;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setExpiry(val);
  };

  // Process Online Payment Verification
  const processPayment = async (methodDetails) => {
    try {
      setLoading(true);

      // Generate a temporary paymentId if not provided by gateway
      const paymentId = `PAY-${Date.now()}`;

      // Verify payment on backend (replace with actual gateway integration)
      await api.post("/payments/verify", {
        bookingId: booking._id,
        razorpay_payment_id: paymentId,
        paymentMethod: methodDetails.method,
      });

      const receipt = {
        invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
        transactionId: paymentId,
        studentName: booking.studentName,
        studentEmail: booking.studentEmail,
        tutorName: booking.tutor?.name || "Verified Tutor",
        subject: booking.subject,
        amount: amount,
        paidAt: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        method: methodDetails.label,
      };

      // Send receipt email (backend endpoint should handle email dispatch)
      try {
        await api.post("/payments/email-receipt", {
          email: booking.studentEmail,
          receipt,
        });
        console.log("Receipt email sent.");
      } catch (emailErr) {
        console.error("Failed to send receipt email:", emailErr);
      }

      setReceiptData(receipt);
      setPaymentSuccess(true);
      toast.success("💳 Payment Successful! Class Confirmed.");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Payment processing failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit Handlers
  const handleUpiSubmit = (e) => {
    e.preventDefault();
    processPayment({ method: "UPI", label: `UPI (${upiId || "GPay/PhonePe"})` });
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    if (!expiry || expiry.length < 5) {
      toast.error("Please enter a valid MM/YY expiry");
      return;
    }
    if (!cvv || cvv.length < 3) {
      toast.error("Please enter 3-digit CVV");
      return;
    }
    processPayment({ method: "CARD", label: "Credit/Debit Card" });
  };

  const handleNetbankSubmit = (e) => {
    e.preventDefault();
    processPayment({ method: "NETBANKING", label: `Netbanking (${selectedBank})` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border-border border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-card border-border border/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                DestinyGurukul Secure Payment
              </h3>
              <p className="text-indigo-200 text-xs mt-0.5">
                256-bit Encrypted SSL Payment Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-card border-border border/10 hover:bg-card border-border border/20 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* PAYMENT SUCCESS RECEIPT SCREEN */}
        {paymentSuccess && receiptData ? (
          <div className="p-8 overflow-y-auto space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
              <CheckCircle size={45} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your home tutoring session has been booked & confirmed.
              </p>
            </div>

            {/* DIGITAL RECEIPT CARD */}
            <div className="bg-background border border-border rounded-2xl p-6 text-left space-y-3 font-mono text-xs text-gray-700">
              <div className="flex justify-between border-b pb-3 font-sans">
                <span className="font-bold text-foreground text-sm">Receipt #{receiptData.invoiceNo}</span>
                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">PAID</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-semibold text-foreground">{receiptData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student Name:</span>
                <span className="font-semibold text-foreground">{receiptData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tutor:</span>
                <span className="font-semibold text-foreground">{receiptData.tutorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="font-semibold text-foreground">{receiptData.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold text-foreground">{receiptData.method}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-sans text-sm">
                <span className="font-bold text-foreground">Amount Paid:</span>
                <span className="font-extrabold text-primary text-base">₹{receiptData.amount}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 border border-gray-300 hover:bg-background text-gray-700 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM & TABS */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* BOOKING SUMMARY BOX */}
            <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Booking Order</p>
                <h4 className="font-bold text-foreground text-base">{booking?.subject} Home Class</h4>
                <p className="text-xs text-muted-foreground">Tutor: {booking?.tutor?.name || "Approved Teacher"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Total Payable</p>
                <p className="text-2xl font-black text-primary">₹{amount}</p>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="grid grid-cols-3 gap-2 bg-background p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  activeTab === "upi"
                    ? "bg-card border-border border text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <QrCode size={16} /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  activeTab === "card"
                    ? "bg-card border-border border text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard size={16} /> Card
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("netbanking")}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  activeTab === "netbanking"
                    ? "bg-card border-border border text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 size={16} /> Netbanking
              </button>
            </div>

            {/* TAB 1: UPI PAYMENT */}
            {activeTab === "upi" && (
              <form onSubmit={handleUpiSubmit} className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center space-y-3">
                  <p className="text-xs text-primary font-semibold">Fast UPI Checkout (GPay, PhonePe, Paytm, BHIM)</p>
                  <div className="w-36 h-36 bg-card border-border border mx-auto rounded-xl p-2 shadow-inner border border-indigo-100 flex flex-col items-center justify-center">
                    <QrCode size={110} className="text-indigo-900" />
                    <span className="text-[10px] font-bold text-primary mt-1">SCAN & PAY</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Or Enter VPA / UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or username@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock size={16} />
                  {loading ? "Processing UPI Payment..." : `Pay ₹${amount} via Instant UPI`}
                </button>
              </form>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {activeTab === "card" && (
              <form onSubmit={handleCardSubmit} className="space-y-4 animate-in fade-in duration-200">
                {/* INTERACTIVE 3D CREDIT CARD PREVIEW */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-5 shadow-xl space-y-4 border border-white/10 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Sparkles className="text-indigo-400" size={24} />
                    <span className="text-xs font-mono font-bold tracking-widest text-indigo-300">SECURE CARD</span>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 uppercase font-mono">Card Number</p>
                    <p className="text-xl font-mono tracking-wider font-bold mt-1">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <div>
                      <p className="text-indigo-300 uppercase">Card Holder</p>
                      <p className="font-semibold uppercase">{cardHolder || booking?.studentName || "STUDENT NAME"}</p>
                    </div>
                    <div>
                      <p className="text-indigo-300 uppercase">Expires</p>
                      <p className="font-semibold">{expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-500 focus:bg-card border-border border transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock size={16} />
                  {loading ? "Verifying Card..." : `Pay ₹${amount} via Card`}
                </button>
              </form>
            )}

            {/* TAB 3: NETBANKING */}
            {activeTab === "netbanking" && (
              <form onSubmit={handleNetbankSubmit} className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-muted-foreground font-medium">Select your bank for secure netbanking login:</p>

                <div className="grid grid-cols-2 gap-3">
                  {["SBI", "HDFC", "ICICI", "AXIS", "KOTAK", "PNB"].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-between transition ${
                        selectedBank === bank
                          ? "border-indigo-600 bg-indigo-50/50 text-primary shadow-xs"
                          : "border-border bg-card border-border border text-gray-700 hover:bg-background"
                      }`}
                    >
                      <span>{bank} Bank</span>
                      {selectedBank === bank && <CheckCircle size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary text-primary-foreground text-white font-bold py-3.5 rounded-xl text-sm shadow-md hover:shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  <Lock size={16} />
                  {loading ? "Redirecting to Bank..." : `Pay ₹${amount} via ${selectedBank} Netbanking`}
                </button>
              </form>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="bg-background border-t border-slate-100 px-6 py-3 text-center text-[11px] text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-muted-foreground">
            <ShieldCheck size={14} className="text-green-600" /> Guaranteed 100% Refund Protection
          </span>
          <span>DestinyGurukul Payment Engine</span>
        </div>
      </div>
    </div>
  );
}

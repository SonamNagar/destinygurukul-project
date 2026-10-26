
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Info,
  AlertCircle,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import api from "../api/axiosInstance";

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user?.email;
  // ==========================================
  // GET NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    if (!email) {
      throw new Error("Please login to see notifications.");
    }
    const response = await api.get(
      `/notifications/user/${encodeURIComponent(email)}`
    );
    return response.data;
  };

  const { data: notifications = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['notifications', email],
    queryFn: fetchNotifications,
    enabled: !!email
  });

  const error = queryError ? queryError.response?.data?.message || queryError.message || "Unable to load notifications." : "";

  // ==========================================
  // MARK ONE READ
  // ==========================================

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/read/${id}`
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // MARK ALL READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      if (!email) return;

      await api.put(
        `/notifications/read-all/${encodeURIComponent(
          email
        )}`
      );
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (type) => {
    if (type === "booking") {
      return (
        <Calendar
          size={22}
          className="text-primary"
        />
      );
    }

    if (type === "application") {
      return (
        <Check
          size={22}
          className="text-green-600"
        />
      );
    }

    return (
      <Info
        size={22}
        className="text-blue-600"
      />
    );
  };

  // ==========================================
  // LOADING SKELETON
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <Skeleton height={32} width={220} className="mb-2" />
          <Skeleton height={18} width={160} className="mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <Skeleton circle width={44} height={44} />
                  <div className="flex-1">
                    <Skeleton height={18} width="75%" />
                    <Skeleton height={14} width={100} className="mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <AlertCircle
            size={45}
            className="mx-auto text-red-500 mb-4"
          />

          <p className="text-red-500 mb-4">
            {error}
          </p>

          <button
            onClick={() => refetch()}
            className="bg-primary text-primary-foreground text-white px-5 py-2 rounded-lg"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-5">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="bg-card rounded-2xl shadow p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="bg-indigo-100 p-3 rounded-full">
                <Bell
                  size={28}
                  className="text-primary"
                />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-foreground">
                  Notifications
                </h1>

                <p className="text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount > 1
                          ? "s"
                          : ""
                      }`
                    : "You're all caught up!"}
                </p>

              </div>

            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-white px-4 py-2 rounded-lg hover:bg-primary text-primary-foreground"
              >
                <CheckCheck size={18} />

                Mark All as Read
              </button>
            )}

          </div>

        </div>

        {/* EMPTY */}

        {notifications.length === 0 ? (
          <div className="bg-card rounded-2xl shadow p-12 text-center">

            <Bell
              size={55}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-xl font-semibold text-gray-700">
              No Notifications
            </h2>

            <p className="text-muted-foreground mt-2">
              You don't have any notifications yet.
            </p>

          </div>
        ) : (

          <div className="space-y-4">

            {notifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={`bg-card rounded-2xl shadow p-5 border-l-4 ${
                    notification.isRead
                      ? "border-border"
                      : "border-indigo-600"
                  }`}
                >

                  <div className="flex gap-4">

                    {/* ICON */}

                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                        notification.isRead
                          ? "bg-gray-100"
                          : "bg-indigo-100"
                      }`}
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                        <div>

                          <p
                            className={`${
                              notification.isRead
                                ? "text-muted-foreground"
                                : "text-foreground font-semibold"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <p className="text-sm text-muted-foreground mt-2">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                        {!notification.isRead && (
                          <span className="text-xs bg-indigo-100 text-primary px-3 py-1 rounded-full">
                            New
                          </span>
                        )}

                      </div>

                      {/* MARK READ */}

                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                          className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-indigo-800"
                        >
                          <Check size={17} />

                          Mark as Read
                        </button>
                      )}

                      {notification.isRead && (
                        <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCheck size={15} />

                          Read
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}
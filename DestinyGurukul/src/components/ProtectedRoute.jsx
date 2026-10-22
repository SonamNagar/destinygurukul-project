import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  // Tokens httpOnly cookie mein hain — JS se read nahi ho sakte (yahi security hai)
  // Sirf user info check karo jo localStorage mein hai
  const userData = localStorage.getItem("user");

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(userData);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // If student trying to access admin dashboard, or vice versa
      if (user.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      if (user.role === "teacher") {
        return <Navigate to="/teacher-dashboard" replace />;
      }
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return children;
}

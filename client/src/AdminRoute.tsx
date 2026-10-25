
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentAdmin } from "./services/authService";

function AdminRoute() {
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">(
    "checking",
  );

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then(() => {
        if (active) setStatus("allowed");
      })
      .catch(() => {
        if (active) setStatus("denied");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <main className="login-page">
        <p role="status">Checking your admin session...</p>
      </main>
    );
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;

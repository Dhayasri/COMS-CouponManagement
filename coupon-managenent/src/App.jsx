import { useState } from "react";
import Login from "./pages/login-page/login";
import Dashboard from "./pages/dashboard/dashboard";
import Coupons from "./pages/coupons/coupons";
import CreateCoupon from "./pages/coupons/createCoupon";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "login") return <Login onLogin={() => setPage("dashboard")} />;
  if (page === "dashboard") return <Dashboard onNavigate={setPage} />;
  if (page === "coupons") return <Coupons onNavigate={setPage} />;
  if (page === "create-coupon") return <CreateCoupon onNavigate={setPage} />;
  return null ; 
}
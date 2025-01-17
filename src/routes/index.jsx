import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PlanList from "../pages/PlanList";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plans" element={<PlanList />} />
    </Routes>
  );
};

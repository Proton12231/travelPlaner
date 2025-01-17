import { useState, useEffect } from "react";
import { CreatePlanModal } from "../../components/common/Modal/CreatePlanModal";
import { PlanCard } from "../../components/PlanCard";
import styles from "./Home.module.scss";

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const savedPlans = JSON.parse(
      localStorage.getItem("travelPlanList") || "[]"
    );
    setPlans(savedPlans);

    const handleOpenModal = () => setIsCreateModalOpen(true);
    window.addEventListener("openCreateModal", handleOpenModal);
    return () => window.removeEventListener("openCreateModal", handleOpenModal);
  }, []);

  const handleSavePlan = (planData) => {
    const newPlan = {
      id: Date.now(),
      ...planData,
      createdAt: new Date().toISOString(),
    };

    const updatedPlans = [...plans, newPlan];
    localStorage.setItem("travelPlanList", JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
    setIsCreateModalOpen(false);
  };

  const handleUpdatePlan = (updatedPlan) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    localStorage.setItem("travelPlanList", JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm("确定要删除该方案吗？")) {
      const updatedPlans = plans.filter((plan) => plan.id !== planId);
      localStorage.setItem("travelPlanList", JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    }
  };

  const handleAbandonPlan = (planId) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === planId ? { ...plan, abandoned: !plan.abandoned } : plan
    );
    localStorage.setItem("travelPlanList", JSON.stringify(updatedPlans));
    setPlans(updatedPlans);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>我的出行方案</h1>
      </div>

      <div className={styles.plans}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onUpdate={handleUpdatePlan}
            onDelete={handleDeletePlan}
            onAbandon={handleAbandonPlan}
          />
        ))}
      </div>

      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default Home;

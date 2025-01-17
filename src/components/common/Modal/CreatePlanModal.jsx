import { Modal } from "./index";
import { CreatePlan } from "./contents/CreatePlan";
import PropTypes from "prop-types";

export const CreatePlanModal = ({ isOpen, onClose, onSave, initialData }) => {
  const handleSave = (formData) => {
    try {
      onSave(formData);
      onClose();
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "编辑出行方案" : "创建出行方案"}
      width="800px"
    >
      <CreatePlan
        onSave={handleSave}
        onCancel={onClose}
        initialData={initialData}
      />
    </Modal>
  );
};

CreatePlanModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

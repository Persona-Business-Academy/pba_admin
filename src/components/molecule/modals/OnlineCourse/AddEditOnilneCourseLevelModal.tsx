import { FC, memo, useCallback } from "react";
import SharedModal from "@/components/molecule/SharedModal";

type Props = {
  onClose: () => void;
};

const AddEditOnlineCourseLevelModal: FC<Props> = ({ onClose }) => {
  const handleSubmit = useCallback(() => {}, []);

  return (
    <SharedModal
      isOpen
      title="Add Level"
      action={handleSubmit}
      actionButtonText="Create"
      onClose={onClose}
      isLoading={false}>
      Inputs
    </SharedModal>
  );
};

export default memo(AddEditOnlineCourseLevelModal);

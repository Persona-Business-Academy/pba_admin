import { FC, memo, useCallback } from "react";
import SharedModal from "../../SharedModal";

type Props = {
  onClose: () => void;
};

const AddEditOnlineCourseDayModal: FC<Props> = ({ onClose }) => {
  const handleSubmit = useCallback(() => {}, []);

  return (
    <SharedModal
      isOpen
      title="Add Day"
      action={handleSubmit}
      actionButtonText="Create"
      onClose={onClose}
      isLoading={false}>
      Inputs
    </SharedModal>
  );
};

export default memo(AddEditOnlineCourseDayModal);

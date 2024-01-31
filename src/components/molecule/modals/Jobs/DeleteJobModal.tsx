import { FC, memo, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { JobService } from "@/api/services/JobService";
import { JobModel } from "@/utils/models/job";

const SharedAlertDialog = dynamic(() => import("../../SharedAlertDialog"));

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  job: NonNullable<JobModel>;
};

const DeleteJobModal: FC<Props> = ({ isOpen, onClose, onSave, job }) => {
  const { mutate, isLoading } = useMutation<JobModel, { message: string }>(
    () => JobService.delete(job.id),
    {
      onSuccess: async () => {
        onSave();
        onClose();
      },
    },
  );

  const Title = useMemo(
    () => (
      <>
        Delete <b>{job.title}</b> Offline Course
      </>
    ),
    [job.title],
  );

  return (
    <SharedAlertDialog
      isOpen={isOpen}
      title={Title}
      isLoading={isLoading}
      deleteFn={mutate}
      onClose={onClose}
    />
  );
};

export default memo(DeleteJobModal);

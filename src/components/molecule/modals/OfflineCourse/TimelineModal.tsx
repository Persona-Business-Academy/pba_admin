import React, { FC, memo, useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { SubmitHandler, useForm } from "react-hook-form";
import { OfflineCourseService } from "@/api/services/OfflineCourseService";
import { SKILL_LEVELS } from "@/utils/constants/courses";
import { QUERY_KEY } from "@/utils/helpers/queryClient";

const SharedModal = dynamic(() => import("@/components/molecule/SharedModal"));

type Props = {
  offlineCourseId: number;
  onClose: () => void;
};

const TimelineModal: FC<Props> = ({ offlineCourseId, onClose }) => {
  const { data: offlineCourse } = useQuery({
    queryKey: QUERY_KEY.offlineCourse(offlineCourseId),
    queryFn: () => OfflineCourseService.getOfflineCourse(offlineCourseId),
    enabled: !!offlineCourseId,
  });

  const skillLevels = useMemo(() => {
    const myLevelOrderNumber = SKILL_LEVELS.find(
      level => level.value === offlineCourse?.courseLevel,
    )?.order;

    if (myLevelOrderNumber) {
      return SKILL_LEVELS.sort((a, b) => a.order - b.order).filter(
        ({ order }) => order <= myLevelOrderNumber,
      );
    }
    return [];
  }, [offlineCourse?.courseLevel]);

  const createTimeline = useMutation<any, { message: string }>(OfflineCourseService.addTimeline);
  const editTimeline = useMutation<any, { message: string }>(data =>
    OfflineCourseService.editTimeline(1, data),
  );

  const { handleSubmit } = useForm();

  const onSubmit: SubmitHandler<any> = useCallback(() => {}, []);

  return (
    <SharedModal
      isOpen
      title={`${!!offlineCourse ? "Edit" : "Create"} Offline Course`}
      action={handleSubmit(onSubmit)}
      actionButtonText={!!offlineCourse ? "Save" : "Create"}
      onClose={onClose}
      isLoading={createTimeline.isLoading || editTimeline.isLoading}
      // actionButtonDisabled={!isDirty && !localImage}
    >
      {JSON.stringify(skillLevels)}
    </SharedModal>
  );
};

export default memo(TimelineModal);

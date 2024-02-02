"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ApplicantService } from "@/api/services/ApplicantService";
import { QUERY_KEY } from "@/utils/helpers/queryClient";

export default function Applicant() {
  const params = useParams<{ id: string }>();

  const applicantId = useMemo(() => {
    const id = +(params?.id || "");
    if (typeof id === "number" && !isNaN(id)) {
      return id;
    }
    return "";
  }, [params?.id]);

  const _ = useQuery({
    queryKey: QUERY_KEY.applicant(+applicantId),
    queryFn: () => ApplicantService.getById(+applicantId),
    enabled: !!applicantId,
  });

  return applicantId;
}

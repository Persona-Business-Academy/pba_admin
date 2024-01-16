"use client";
import React from "react";
import { Comments } from "@/components/organism";
import { useOfflineCourse } from "@/contexts/OfflineCourseContext";

export default function OfflineCourseForKidsComments() {
  const { data } = useOfflineCourse();

  return <Comments courseId={data.id} courseType="offline" />;
}

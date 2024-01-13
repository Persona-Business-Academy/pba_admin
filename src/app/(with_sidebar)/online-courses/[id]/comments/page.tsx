"use client";
import React from "react";
import { Comments } from "@/components/organism";
import { useOnlineCourse } from "@/contexts/OnlineCourseContext";

export default function OnlineCourseComments() {
  const { data } = useOnlineCourse();

  return <Comments courseId={data.id} courseType="online" />;
}

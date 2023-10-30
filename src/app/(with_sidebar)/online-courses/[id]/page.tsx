"use client";
import React from "react";
import { Day, Level } from "@/components/atom";
import { OnlineCourseVideos } from "@/components/molecule";
import { OnlineCourseItemHeading } from "@/components/organism";
import { useOnlineCourse } from "@/context/OnlineCourseContext";

export default function OnlineCourses() {
  const { data } = useOnlineCourse();

  return (
    <OnlineCourseItemHeading title="Levels" type="levels" onlineCourseId={data.id}>
      {data.levels.map(({ id: levelId, level, days }) => {
        return (
          <Level key={`${level}-${levelId}`} id={levelId} level={level} onlineCourseId={data.id}>
            <OnlineCourseItemHeading
              title="Days"
              type="days"
              onlineCourseId={data.id}
              levelId={levelId}>
              {days.map(({ id: dayId, label, videos }) => {
                return (
                  <Day key={`${label}-${dayId}`} id={dayId} day={label} onlineCourseId={data.id}>
                    <OnlineCourseVideos
                      videos={videos}
                      onlineCourseId={data.id}
                      levelId={levelId}
                      dayId={dayId}
                    />
                  </Day>
                );
              })}
            </OnlineCourseItemHeading>
          </Level>
        );
      })}
    </OnlineCourseItemHeading>
  );
}

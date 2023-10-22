"use client";

type Props = { params: { id: string } };

export default function OnlineCourses({ params }: Props) {
  return <>Online course page single - {params.id}</>;
}

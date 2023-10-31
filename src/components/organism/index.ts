"use client";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"));
const Sidebar = dynamic(() => import("./Sidebar"));
const OnlineCourseItemHeading = dynamic(() => import("./OnlineCourseItemHeading"));

export { Footer, Sidebar, OnlineCourseItemHeading };

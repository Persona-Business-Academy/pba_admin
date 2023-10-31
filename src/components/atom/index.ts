"use client";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("./Button"));
const EditableCustom = dynamic(() => import("./EditableCustom"));
const FormInput = dynamic(() => import("./FormInput"));
const Day = dynamic(() => import("./OnlineCourseItem/Day"));
const Level = dynamic(() => import("./OnlineCourseItem/Level"));
const Video = dynamic(() => import("./OnlineCourseItem/Video"));
const UploadFile = dynamic(() => import("./UploadFile"));
const VideoPreview = dynamic(() => import("./VideoPreview"));

export { Button, FormInput, UploadFile, Level, Video, Day, EditableCustom, VideoPreview };

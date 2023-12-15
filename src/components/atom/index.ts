"use client";
import dynamic from "next/dynamic";
import Button from "./Button";
import CustomSelect from "./CustomSelect";
import EditableCustom from "./EditableCustom";
import FormInput from "./FormInput";
import Day from "./OnlineCourseItem/Day";
import Level from "./OnlineCourseItem/Level";
import Video from "./OnlineCourseItem/Video";
import UploadFile from "./UploadFile";

const VideoPreview = dynamic(() => import("./VideoPreview"));

export {
  Button,
  FormInput,
  UploadFile,
  Level,
  Video,
  Day,
  EditableCustom,
  VideoPreview,
  CustomSelect,
};

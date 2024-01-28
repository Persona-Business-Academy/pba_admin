import { Currency, Language, SkillLevel, Topic } from "@prisma/client";

export type Maybe<T> = T | null;

export type UploadProgressType = {
  fileName: string;
  progress: number;
  key: string;
};

export type UploadFileToAwsRes = { url: string; key: string };
export type GetSignatureReq = { datetime: string; to_sign: string };

export type UploadFileToAwsReq = {
  file: File;
  fileName: string;
  resolve: (url: UploadFileToAwsRes) => void;
  handleUploadProgress?: (args: UploadProgressType) => void;
};

export type LanguageType = Language;
export type TopicType = Topic;
export type CurrencyType = Currency;
export type SkillLevelType = SkillLevel;

export type WhatYouWillLearnType = { id: string; value: string };
export type TimelineType = { id: string; value: Date };

export type CourseType = "offline" | "online";

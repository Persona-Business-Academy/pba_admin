import Evaporate from "evaporate";
import MD5 from "js-md5";
import { Message, sha256 as SHA256 } from "js-sha256";
import { UploadFileToAwsReq, UploadFileToAwsRes } from "@/utils/models/common";

const uploadDocumentWithSignerToAWS = async (options: UploadFileToAwsReq) => {
  try {
    const { file, fileName, handleUploadProgress, resolve } = options;

    const extension = file.name.split(".").pop();
    let contentType = "application/" + file.type.split("/").slice(-1)[0];

    if (contentType === "application/svg+xml") {
      contentType = "image/svg+xml";
    }

    const evaporate = await Evaporate.create({
      signerUrl: `${process.env.NEXT_PUBLIC_API_URL}/aws/signature`,
      aws_key: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      awsRegion: process.env.NEXT_PUBLIC_AWS_REGION,
      cloudfront: true,
      computeContentMd5: true,
      cryptoMd5Method: x => {
        const o = MD5.md5.create();
        o.update(x);
        return o.base64();
      },
      cryptoHexEncodedHash256: x => {
        const o = SHA256.create();
        o.update(x as Message);
        return o.hex();
      },
    });
    const name = `${fileName}.${extension}`;

    await evaporate.add({
      file,
      name,
      contentType,
      xAmzHeadersAtInitiate: { "x-amz-acl": "public-read" },
      ...(!!handleUploadProgress
        ? {
            progress: progressValue => {
              handleUploadProgress({ progress: progressValue, key: fileName, fileName: name });
            },
          }
        : {}),
      complete: _xhr => {
        const [URL] = _xhr.responseURL.split("?");
        resolve({ url: URL, key: name });
      },
    });
  } catch (e) {
    throw new Error(e as string);
  }
};

export const uploadDocumentToAWS = (
  options: Omit<UploadFileToAwsReq, "resolve">,
): Promise<UploadFileToAwsRes> => {
  return new Promise(resolve => {
    uploadDocumentWithSignerToAWS({
      ...options,
      resolve,
    });
  });
};

export const generateOnlineCourseVideoName = (id: number, levelId: number, dayId: number) =>
  `OnlineCourses/${id}/Level-${levelId}/Day-${dayId}/Video/${Date.now()}`;

export const generateOnlineCourseCoverPhotoName = (id: string) =>
  `OnlineCourses/${id}/CoverPhoto/${Date.now()}`;

export const generateFileNames = (
  id: string,
  type:
    | "OfflineCourseAbout"
    | "InstructorAvatar"
    | "OfflineCourseCoverPhoto"
    | "OfflineCourseWhatYouWillLearnPhotoName"
    | "OfflineCourseGraduationPhoto"
    | "OfflineCoursePdf"
    | "Comments",
) => {
  const offlineCoursePrefix = `OfflineCourses/${id}`;
  const instructorPrefix = `Instructors/${id}`;

  switch (type) {
    case "OfflineCourseAbout":
      return `${offlineCoursePrefix}/About/${Date.now()}`;
    case "InstructorAvatar":
      return `${instructorPrefix}/Avatar/${Date.now()}`;
    case "OfflineCourseCoverPhoto":
      return `${offlineCoursePrefix}/CoverPhoto/${Date.now()}`;
    case "OfflineCourseWhatYouWillLearnPhotoName":
      return `${offlineCoursePrefix}/WhatYouWillLearnPhoto/${Date.now()}`;
    case "OfflineCourseGraduationPhoto":
      return `${offlineCoursePrefix}/GraduationPhoto/${Date.now()}`;
    case "OfflineCoursePdf":
      return `${offlineCoursePrefix}/pdf/${Date.now()}`;
    case "Comments":
      return `Comments/${id}/${Date.now()}`;
    default:
      return "";
  }
};

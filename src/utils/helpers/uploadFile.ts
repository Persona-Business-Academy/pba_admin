import Evaporate from "evaporate";
import MD5 from "js-md5";
import { Message, sha256 as SHA256 } from "js-sha256";
import { UploadFileToAwsReq, UploadFileToAwsRes } from "@/utils/models/common";

const uploadDocumentWithSignerToAWS = async (options: UploadFileToAwsReq) => {
  try {
    const { file, fileName, handleUploadProgress, resolve } = options;

    const extension = file.name.split(".").pop();
    let contentType = "application/" + file.type.split("/").slice(-1)[0];

    if (contentType === "application/pdf") {
      contentType = "octet-stream";
    }
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
    throw e;
  }
};

export const uploadDocumentToAWS = async (
  options: Omit<UploadFileToAwsReq, "resolve">,
): Promise<UploadFileToAwsRes> => {
  try {
    return await new Promise(resolve => {
      uploadDocumentWithSignerToAWS({
        ...options,
        resolve,
      });
    });
  } catch (e) {
    throw e;
  }
};

export const generateOnlineCourseVideoName = (id: number, levelId: number, dayId: number) =>
  `OnlineCourses/OnlineCourse-${id}/Level-${levelId}/Day-${dayId}/Video-${Date.now()}`;

export const generateOfflineCourseVideoName = (id: number) =>
  `OfflineCourses/OfflineCourse-${id}/About-${Date.now()}`;

export const generateOnlineCourseCoverPhotoName = (id: string) =>
  `OnlineCourses/OnlineCourse-${id}/CoverPhoto-${Date.now()}`;

export const generateInstructorAvatarName = (id: string) =>
  `Instructors/Instructor-${id}/CoverPhoto-${Date.now()}`;

export const generateOfflineCourseCoverPhotoName = (id: string) =>
  `OfflineCourses/OfflineCourse-${id}/CoverPhoto-${Date.now()}`;

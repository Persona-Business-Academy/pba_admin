export type Maybe<T> = T | null;

export type UploadProgressType = {
  fileName: string;
  progress: number;
};

export type UploadFileToAwsRes = { url: string; fileName: string };
export type GetSignatureReq = { datetime: string; to_sign: string };

export type UploadFileToAwsReq = {
  file: File;
  fileName: string;
  resolve: (url: UploadFileToAwsRes) => void;
  handleUploadProgress: (args: UploadProgressType) => void;
};
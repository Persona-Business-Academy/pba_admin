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
  handleUploadProgress: (args: UploadProgressType) => void;
};

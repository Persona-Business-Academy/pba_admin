import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  useAccelerateEndpoint: true,
});

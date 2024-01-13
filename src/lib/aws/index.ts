import { DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import * as crypto from "crypto";

export class AwsService {
  private static awsS3 = new S3({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    },
  });

  private static hmac(key: crypto.BinaryLike | crypto.KeyObject, string: string) {
    const hmacObj = crypto.createHmac("sha256", key);
    hmacObj.end(string);

    return hmacObj.read();
  }

  static getSignature({ dateTime, toSign }: { dateTime: string; toSign: string }): string {
    const { hmac } = this;
    const timestamp = dateTime.substr(0, 8);
    const dateKey = hmac(`AWS4${process.env.NEXT_PUBLIC_AWS_SECRET_KEY}`, timestamp);
    const dateRegionKey = hmac(dateKey, process.env.NEXT_PUBLIC_AWS_REGION);
    const dateRegionServiceKey = hmac(dateRegionKey, "s3");
    const signingKey = hmac(dateRegionServiceKey, "aws4_request");

    return hmac(signingKey, toSign).toString("hex");
  }

  static async deleteFromStorage(existingKey: string, key: string) {
    if (!!existingKey && existingKey !== key) {
      const s3Command = new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: existingKey,
      });

      await this.awsS3.send(s3Command);
    }
  }
}

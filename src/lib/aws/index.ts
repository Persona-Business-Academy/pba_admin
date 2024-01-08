import * as crypto from "crypto";

export class AwsService {
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
}

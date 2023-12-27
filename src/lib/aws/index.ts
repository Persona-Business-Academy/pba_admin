import * as crypto from "crypto";

export class AwsService {
  private hmac(key: crypto.BinaryLike | crypto.KeyObject, string: string) {
    const hmacObj = crypto.createHmac("sha256", key);
    hmacObj.end(string);

    return hmacObj.read();
  }

  static getSignature({ dateTime, toSign }: { dateTime: string; toSign: string }): string {
    const instance = new AwsService();
    const timestamp = dateTime.substr(0, 8);
    const dateKey = instance.hmac(`AWS4${process.env.NEXT_PUBLIC_AWS_SECRET_KEY}`, timestamp);
    const dateRegionKey = instance.hmac(dateKey, process.env.NEXT_PUBLIC_AWS_REGION);
    const dateRegionServiceKey = instance.hmac(dateRegionKey, "s3");
    const signingKey = instance.hmac(dateRegionServiceKey, "aws4_request");

    return instance.hmac(signingKey, toSign).toString("hex");
  }
}

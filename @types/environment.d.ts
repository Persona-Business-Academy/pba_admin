/* eslint-disable unused-imports/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;

    JWT_SECRET: string;
    BASE_URL: string;
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXT_PUBLIC_CLOUD_FRONT_URL:string
    NEXT_PUBLIC_AWS_STORAGE_URL: string;
    NEXT_PUBLIC_AWS_ACCESS_KEY: string;
    NEXT_PUBLIC_AWS_SECRET_KEY: string;
    NEXT_PUBLIC_AWS_BUCKET_NAME: string;
    NEXT_PUBLIC_AWS_REGION: string;
  }
}

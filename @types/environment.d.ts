/* eslint-disable unused-imports/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;

    JWT_SECRET: string;
    BASE_URL: string;
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXT_PUBLIC_AWS_STORAGE_URL: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_KEY: string;
    AWS_BUCKET_NAME: string;
    AWS_REGION: string;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
 webpack(config) {
  config.module.rules.push({
   test: /\.svg$/i,
   issuer: /\.[jt]sx?$/,
   use: ["@svgr/webpack"],
  });

  return config;
 },
 async redirects() {
  return [
   {
    source: "/",
    destination: "/signin",
    permanent: true,
   },
  ];
 },
};

module.exports = nextConfig;

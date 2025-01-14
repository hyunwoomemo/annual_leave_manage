/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true /** 설정할 경우 빌드시 타입 에러 통과 */,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
        port: "",
      },
    ],
  },
  transpilePackages: ["geist"],
};

module.exports = nextConfig;

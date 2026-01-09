/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // ⭐ 이 한 줄 추가 (핵심)

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
      },
    ],
  },

  transpilePackages: ["geist"],
};

module.exports = withPWA(nextConfig);

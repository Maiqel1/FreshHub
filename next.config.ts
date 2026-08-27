import type { NextConfig } from "next";

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: storageBucket
      ? [
          {
            protocol: "https",
            hostname: "storage.googleapis.com",
            pathname: `/${storageBucket}/**`,
          },
        ]
      : [],
  },
};

export default nextConfig;

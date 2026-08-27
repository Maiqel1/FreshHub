import type { NextConfig } from "next";

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  experimental: {
    serverActions: {
      // Must exceed MAX_PHOTO_BYTES; Vercel rejects request bodies over 4.5mb.
      bodySizeLimit: "4.5mb",
    },
  },
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

import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

export const PHOTO_PREFIX = "menu-photos";
export const CATEGORIES = "categories";
export const ITEMS = "items";

function credentials() {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };
}

export function isFirebaseConfigured(): boolean {
  const c = credentials();
  return Boolean(c.projectId && c.clientEmail && c.privateKey && c.storageBucket);
}

let cached: App | undefined;

function app(): App {
  if (cached) return cached;
  const c = credentials();
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured — set FIREBASE_* in .env.local (see .env.local.example)",
    );
  }
  cached =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: c.projectId!,
        clientEmail: c.clientEmail!,
        privateKey: c.privateKey!,
      }),
      storageBucket: c.storageBucket!,
    });
  return cached;
}

export function getDb() {
  return getFirestore(app());
}

export function getAdminAuth() {
  return getAuth(app());
}

export function getBucket() {
  return getStorage(app()).bucket();
}

export function photoPublicUrl(path: string): string {
  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${path}`;
}

import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { loadEnv, privateKey, requireVars } from "./env.mjs";

const email = process.argv[2];
if (!email) {
  console.error("usage: node scripts/set-staff-claim.mjs <email>");
  process.exit(1);
}

const env = loadEnv();
requireVars(env, [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
]);

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey(env),
  }),
});

const auth = getAuth(app);
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { staff: true });

const check = await auth.getUser(user.uid);
console.log(`uid:    ${check.uid}`);
console.log(`email:  ${check.email}`);
console.log(`claims: ${JSON.stringify(check.customClaims)}`);
console.log("\nsign in again if this account already had a session.");

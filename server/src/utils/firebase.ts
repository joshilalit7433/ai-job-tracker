import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "../config/ai-job-tracker-1711d-firebase-adminsdk-fbsvc-6d31df3008.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

export default admin;

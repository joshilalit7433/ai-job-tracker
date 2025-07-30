interface ImportMetaEnv {
  VITE_FIREBASE_APP_ID: any;
  VITE_FIREBASE_MESSAGING_SENDER_ID: any;
  VITE_FIREBASE_STORAGE_BUCKET: any;
  VITE_FIREBASE_PROJECT_ID: any;
  VITE_FIREBASE_AUTH_DOMAIN: any;
  VITE_FIREBASE_API_KEY: any;
  readonly VITE_USER_API_URL: string;
  readonly VITE_JOB_APPLICATION_API_URL: string;
  readonly VITE_JOB_APPLICANT_API_URL: string;
  readonly VITE_BACKEND_BASE_URL: string;
  readonly VITE_NOTIFICATION_API_URL: string;
  readonly VITE_RECRUITER_DASHBOARD_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
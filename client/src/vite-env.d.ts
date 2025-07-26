interface ImportMetaEnv {
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
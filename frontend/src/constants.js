export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

export const USERS_URL = `${BASE_URL}/api/users`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
export const DATASET_URL = `${BASE_URL}/api/datasets`;

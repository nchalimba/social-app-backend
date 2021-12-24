import dotenv from "dotenv";
dotenv.config();
import { initializeApp } from "firebase-admin/app";
import firebaseAdmin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";

const firebaseConfig = {
  type: process.env.FIREBASE_CONFIG_TYPE,
  project_id: process.env.FIREBASE_CONFIG_PROJECT_ID,
  private_key_id: process.env.FIREBASE_CONFIG_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_CONFIG_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CONFIG_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CONFIG_CLIENT_ID,
  auth_uri: process.env.FIREBASE_CONFIG_AUTH_URI,
  token_uri: process.env.FIREBASE_CONFIG_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_CONFIG_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CONFIG_CLIENT_X509_CERT_URL,
};

// Initialize Firebase
const firebaseApp = initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
});
const storage = getStorage(firebaseApp);
const bucket = storage.bucket(process.env.FIREBASE_CONFIG_STORAGE_BUCKET);
export { firebaseApp, bucket };

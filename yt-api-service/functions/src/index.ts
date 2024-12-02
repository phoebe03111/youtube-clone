import { Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "pc-raw-videos";

// v1 function
exports.createUser = functions.auth.user().onCreate((user: any) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    // photo: user.photoUrl
  };

  firestore.collection("users").doc(user.uid).set(userInfo);

  logger.info(`User created: ${JSON.stringify(userInfo)}`);
  return;
});

// v2 function
export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if the user if authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called whle authenticated"
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate an uniqle file name with the file extension name
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { url, fileName };
  }
);

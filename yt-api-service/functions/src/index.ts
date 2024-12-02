import { Firestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = new Firestore();

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

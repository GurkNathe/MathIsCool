import * as admin from "firebase-admin";

//just testing with firestore

admin.initializeApp();

const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');

await docRef.set({
  email: "test@test.com",
  password: "123456789"
});

const snapshot = await db.collection('users').get();
snapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});
// main.js - shared Firebase logic (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

/*
Firebase config - use exactly what you provided
*/
const firebaseConfig = {
  apiKey: "AIzaSyCtLvR-Do2q-AzMZsXIYn-MdRkBs3PvuUA",
  authDomain: "basic-forms-db145.firebaseapp.com",
  projectId: "basic-forms-db145",
  storageBucket: "basic-forms-db145.appspot.com", // FIXED
  messagingSenderId: "272342059583",
  appId: "1:272342059583:web:8a9af2d6c15de50575868a",
  measurementId: "G-37Z6D6JFP0"
};


// initialize
const app = initializeApp(firebaseConfig);
try { getAnalytics(app); } catch (e) { /* analytics may fail on local env */ }
const db = getFirestore(app);

/* Utilities */
export function uidShort() {
  // short random id (6 chars)
  return Math.random().toString(36).slice(2, 8);
}

/* Create a new form document with the given id */
export async function createFormDoc(formId, formObj) {
  // writes full document at collection 'forms' doc formId
  const d = doc(db, 'forms', formId);
  await setDoc(d, formObj);
  return formObj;
}

/* Fetch a form doc by id (returns object or null) */
export async function fetchFormDoc(formId) {
  const d = doc(db, 'forms', formId);
  const snap = await getDoc(d);
  if (!snap.exists()) return null;
  return snap.data();
}

/* Submit answer: append to answers array using arrayUnion */
export async function submitFormAnswer(formId, answerObj) {
  const d = doc(db, 'forms', formId);
  await updateDoc(d, { answers: arrayUnion(answerObj) });
}

/* Update some fields of the form doc */
export async function updateFormDoc(formId, partial) {
  const d = doc(db, 'forms', formId);
  await updateDoc(d, partial);
}

/* Listen for realtime updates on a form doc; callback(updatedDoc) */
export function listenFormRealtime(formId, callback) {
  const d = doc(db, 'forms', formId);
  return onSnapshot(d, snap => {
    if (!snap.exists()) { callback(null); return; }
    callback(snap.data());
  });
}

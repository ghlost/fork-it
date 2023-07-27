import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

// firebase init goes here
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SEND_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENTS_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// firebase utils
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// firebase collections
const usersCollection = collection(db, 'users');
const postsCollection = collection(db, 'posts');
const recipesCollection = collection(db, 'recipes');
const commentsCollection = collection(db, 'comments');
const likesCollection = collection(db, 'likes');

export {
  db,
  auth,
  usersCollection,
  postsCollection,
  recipesCollection,
  commentsCollection,
  likesCollection
};

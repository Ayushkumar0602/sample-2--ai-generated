// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVYdfql5aqHrChlA1v3nxRLkIbYyWMvUg",
  authDomain: "study2-7bdc7.firebaseapp.com",
  projectId: "study2-7bdc7",
  storageBucket: "study2-7bdc7.firebasestorage.app",
  messagingSenderId: "320617984870",
  appId: "1:320617984870:web:04b61ea4ee88ae057e4ea7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// --- Firestore Helper Functions ---

// Function to create a new document in a collection
const createDocument = async (collectionName, documentId, data) => {
  try {
    await setDoc(doc(db, collectionName, documentId), data);
    console.log("Document created successfully!");
    return true;
  } catch (error) {
    console.error("Error creating document: ", error);
    return false;
  }
};

// Function to get a document from a collection
const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

// Function to get all documents from a collection
const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error getting all documents: ", error);
    return [];
  }
};

// Function to update a document in a collection
const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
    console.log("Document updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
};

// Function to delete a document from a collection
const deleteDocument = async (collectionName, documentId) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    console.log("Document deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
};

// Function to query documents based on a condition
const queryDocuments = async (collectionName, field, operator, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
    return [];
  }
};

// --- Authentication Helper Functions ---

// Function to create a user with email and password
const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created successfully!");
    return user;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// Function to sign in with email and password
const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in successfully!");
    return user;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// Function to sign out
const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully!");
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    return false;
  }
};

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in with Google successfully!");
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};

// Function to observe authentication state changes
const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export {
  db,
  auth,
  createDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments,
  createUser,
  signInUser,
  signOutUser,
  signInWithGoogle,
  onAuthStateChangedListener
};
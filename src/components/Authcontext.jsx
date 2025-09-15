// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; // New: Import Firestore functions
import { db } from '../firebase/firebaseConfig'; // New: Import the Firestore instance
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // New: Auth functions

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null); // The state you'll use to store the fetched data

  // New: This useEffect handles the persistent login state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch student data from Firestore after a successful login
        const studentDocRef = doc(db, 'students', user.uid);
        const studentDoc = await getDoc(studentDocRef);
        if (studentDoc.exists()) {
          setStudentInfo({ ...studentDoc.data(), uid: user.uid });
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setStudentInfo(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle fetching and setting studentInfo
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'students', user.uid), {
        name: userData.name,
        rollNumber: userData.roll,
        semester: userData.semester,
        email: user.email,
        // ... any other student details you want to save
      });
      // The onAuthStateChanged listener will handle fetching and setting studentInfo
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    return auth.signOut();
  };

  const value = {
    currentUser,
    studentInfo, // Pass studentInfo to the context
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
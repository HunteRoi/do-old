import { initializeApp } from 'firebase/app';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, AuthProvider, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { Event } from '../models';

import { firebaseConfig } from './';

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export const Providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider()
};

export const signIn = async (provider: AuthProvider) => {
    auth.useDeviceLanguage();
    try {
        const credentials = await signInWithPopup(auth, provider);
        const userRef = doc(db, 'users', credentials.user.uid);
        await setDoc(userRef, credentials.user.providerData[0], { merge: true });
    } catch (err) {
        console.error(err);
    }
};

export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (err) {
        console.error(err);
    }
};

export const createEvent = async (event: Event) => {
    const docRef = doc(db, 'events', event.id);
    await setDoc(docRef, event);
};

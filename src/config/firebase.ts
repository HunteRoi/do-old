import { initializeApp } from 'firebase/app';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, AuthProvider, getAuth } from 'firebase/auth';

import { firebaseConfig } from './';

initializeApp(firebaseConfig);
const auth = getAuth();

export const Providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider()
};

export const signIn = async (provider: AuthProvider) => {
    auth.useDeviceLanguage();
    try {
        await signInWithPopup(auth, provider);
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
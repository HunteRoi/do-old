import { signInWithPopup, getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const auth = getAuth();

const signIn = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    auth.useDeviceLanguage();
    try {
        await signInWithPopup(auth, provider);
    } catch (err) {
        console.error(err);
    }
};

const signOut = async () => {
    try {
        await auth.signOut();
    } catch (err) {
        console.error(err);
    }
};

export {
    auth,
    signIn,
    signOut
};
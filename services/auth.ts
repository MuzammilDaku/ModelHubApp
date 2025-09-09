import { auth } from "firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";

export class AuthService {
    constructor() { }
    signUpWithEmaiLAndPassword(email: string, password: string) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                sendEmailVerification(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    signInWithGoogle() {
        // Implement Google Sign-In logic here
    }
}
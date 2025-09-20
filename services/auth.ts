import { auth } from "firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { api } from "server/api";

export class AuthService {
  constructor() {}

  async signUpWithEmaiLAndPassword(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      if (user?.email) {
        await api.createUser({
          email: user.email,
        });
      }
    } catch (error: any) {
      console.error("Signup failed:", error.code, error.message);
    }
  }

  signInWithGoogle() {
    // Implement Google Sign-In logic here
  }
}

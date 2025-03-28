// import { useState, useEffect, createContext, useContext } from "react";
// import { auth } from "@/firebaseConfig"; // Ensure correct Firebase config import
// import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
// import {User} from "firebase/auth";

// interface AuthContextType {
//   user: CustomUser | null;
//   loading: boolean;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// import { ReactNode } from "react";

// interface CustomUser extends FirebaseUser {
//   name: string;
//   profilePicture: string;
// }

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
//       if (authenticatedUser) {
//         setUser({
//           uid: authenticatedUser.uid,
//           name: authenticatedUser.displayName || "User",
//           email: authenticatedUser.email,
//           profilePicture: authenticatedUser.photoURL || "", // Default if no photo
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };


import { useEffect } from "react";
import {auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "../context/UserContext";
import { useRouter } from "expo-router";

export const useAuth = () => {
  const { setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to your app's user object
        const user = {
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          role: "User", // Replace with actual role from Firestore
          profilePicture:
            firebaseUser.photoURL || "https://via.placeholder.com/150",
        };
        setUser(user); // Update context
        router.replace("/(main)/(tabs)"); // Redirect to main layout
      } else {
        setUser(null); // Clear context
        router.replace("/(auth)/auth"); // Redirect to auth layout
      }
    });

    return () => unsubscribe();
  }, []);
};
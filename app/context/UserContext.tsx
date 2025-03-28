import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  phone?: string;
  bio?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              name: userData.name || "",
              email: userData.email || "",
              role: userData.role || "student",
              profilePicture: userData.profilePicture,
              phone: userData.phone,
              bio: userData.bio,
              location: userData.location,
              createdAt: userData.createdAt?.toDate(),
              updatedAt: userData.updatedAt?.toDate(),
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

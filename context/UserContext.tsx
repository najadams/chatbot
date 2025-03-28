import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserContextType = {
  name: string;
  email: string;
  phone: string;
  emailverified: boolean;
  isanonymous: boolean;
  role: string;
  profilePicture: string;
} | null;

interface UserContextProps {
  user: UserContextType;
  setUser: (user: UserContextType) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserContextType;
}

export function UserProvider({
  children,
  initialUser = null,
}: UserProviderProps) {
  const [user, setUser] = useState<UserContextType>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}

export function useSetUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useSetUser must be used within a UserProvider");
  }
  return context.setUser;
}

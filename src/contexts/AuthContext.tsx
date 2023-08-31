'use client';
import React, { createContext, FC, useContext } from 'react';

interface AuthState {
  // todo
}

interface Props {
  // todo
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider: FC<Props> = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

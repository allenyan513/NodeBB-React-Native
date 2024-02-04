import {createContext, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [isAuthAlready, setIsAuthAlready] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (isAuthAlready) {
      return;
    }
    const subscriber = auth().onAuthStateChanged(userState => {
      // console.log('onAuthStateChanged', userState);
      setCurrentUser(userState);
      setIsAuthAlready(true);
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthAlready,
        setIsAuthAlready,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

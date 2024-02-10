import {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {useQueryClient} from '@tanstack/react-query';
import {User} from '../types.tsx';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import UserAPI from '../service/userAPI.tsx';
import {useNavigation} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId:
    '657481286430-6dqd00nv90aiff1tpjv346uldnesvl6u.apps.googleusercontent.com',
});
interface AuthContextProps {
  currentUser: FirebaseAuthTypes.User | undefined;
  setCurrentUser: any;
  isAuthAlready: boolean;
  setIsAuthAlready: any;
  user: User | undefined;
  verifyToken: string | undefined;
  googleSignIn: any;
  appleSignIn: any;
  emailSignIn: any;
  signOut: any;
  deleteUser: any;
  refreshVerifyTokenAndUser: any;
  checkSignIn: any;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({children}: {children: any}) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isAuthAlready, setIsAuthAlready] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User>();

  const [verifyToken, setVerifyToken] = useMMKVString('user.verifyToken');
  const [user, setUser] = useMMKVObject<User>('user');

  const checkSignIn = () => {
    if (!currentUser) {
      // @ts-ignore
      navigation.navigate('SignIn');
      return false;
    }
    return true;
  };

  const deleteUser = async () => {
    await auth().currentUser?.delete();
    console.log('User deleted!');
    await clear();
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      await clear();
    } catch (e) {
      console.error(e);
    }
  };

  const clear = async () => {
    // 登出成功后清理函数
    await queryClient.invalidateQueries();
    setVerifyToken('');
    setUser(undefined);
  };
  /**
   * 一个方法刷新verifyToken 和 user
   * @return {Promise<void>}
   */
  const refreshVerifyTokenAndUser = async () => {
    try {
      const res = await UserAPI.exchangeVerifyToken();
      setVerifyToken(res.response.verifyToken);
      const resUser = await UserAPI.getUserByUid(res.response.uid);
      setUser(resUser);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 1. GoogleSignIn
   * 2. idToken 换取 nodebb verifyToken
   * 3. 用 verifyToken 换取用户信息
   * @return {Promise<void>}
   */
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      //刷新用户verifyToken和用户信息
      await refreshVerifyTokenAndUser();
    } catch (e) {
      console.error(e);
    }
  };

  const appleSignIn = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }
      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      // Sign the user in with the credential
      await auth().signInWithCredential(appleCredential);
      await refreshVerifyTokenAndUser();
    } catch (e) {
      console.error(e);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      //刷新用户verifyToken和用户信息
      await refreshVerifyTokenAndUser();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthAlready) {
      return;
    }
    const subscriber = auth().onAuthStateChanged(userState => {
      // console.log('onAuthStateChanged', userState);
      // @ts-ignore
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
        user,
        verifyToken,
        googleSignIn,
        appleSignIn,
        emailSignIn,
        signOut,
        deleteUser,
        refreshVerifyTokenAndUser,
        checkSignIn,
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

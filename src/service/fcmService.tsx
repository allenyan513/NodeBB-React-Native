import messaging from '@react-native-firebase/messaging';
const FcmService = {
  setBackgroundMessageHandler: () => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  },

  getDeviceToken: async () => {
    //await messaging().registerDeviceForRemoteMessages();
    return await messaging().getToken();
  },

  requestUserPermission: async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  },

  onMessage: () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  },
};

export default FcmService;

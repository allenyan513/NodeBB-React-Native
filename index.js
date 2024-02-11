/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import fcmService from './src/service/fcmService';

fcmService.setBackgroundMessageHandler();

// Check if app was launched in the background and conditionally render null if so
function HeadlessCheck({isHeadless}) {
  console.log('isHeadless', isHeadless);
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  // Render the app component on foreground launch
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

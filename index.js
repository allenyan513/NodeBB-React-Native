/**
 * @format
 */

import {LogBox} from 'react-native';
LogBox.ignoreLogs([
  'Warning: In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
]);
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

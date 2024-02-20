import {Options, RNS3} from 'react-native-aws3';
import {Asset} from 'react-native-image-picker';
import Config from 'react-native-config';

const options: Options = {
  keyPrefix: '',
  bucket: Config.AWS_BUCKET || '',
  region: Config.AWS_REGION || '',
  accessKey: Config.AWS_ACCESS_KEY || '',
  secretKey: Config.AWS_SECRET_KEY || '',
  successActionStatus: 201,
};

const AWSHelper = {
  uploadAssets: async function (assets: Asset[]) {
    if (!assets || assets.length === 0) {
      return [];
    }
    const urls = [];
    for (let i = 0; i < assets.length; i++) {
      const res = await this.uploadFile(
        // @ts-ignore
        assets[i].uri,
        assets[i].fileName,
        assets[i].type,
      );
      urls.push(res);
    }
    return urls;
  },

  uploadFile: async function (uri: string, name: string, type: string) {
    const file = {
      uri: uri,
      name: name,
      type: type,
    };
    const res = await RNS3.put(file, options)._promise;
    return res.headers.location;
  },
};

export default AWSHelper;

import {Options, RNS3} from 'react-native-aws3';

const options: Options = {
  keyPrefix: '',
  bucket: 'halifaxer-nodebb',
  region: 'us-east-2',
  accessKey: 'AKIAZTFNRMBTIYTHO7AA',
  secretKey: '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',
  successActionStatus: 201,
};

const AWSHelper = {
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

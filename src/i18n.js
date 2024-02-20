import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {Alert, ListRenderItem, Text} from 'react-native';
import {isEmpty} from './utils';
import React, {useEffect} from 'react';
import {Asset} from 'react-native-image-picker';
import COLORS from './colors';
import AWSHelper from './service/AWSHepler';
import UserAPI from './service/userAPI';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Home: 'Home',
      Publish: 'Publish',
      Notification: 'Notification',
      Recent: 'Recent',
      Popular: 'Popular',
      Cancel: 'Cancel',
      OK: 'OK',
      Publishing: 'Publishing',
      Title: 'Title',
      Email: 'Email',
      Password: 'Password',
      Success: 'Success',
      Error: 'Error',
      Delete: 'Delete',
      Setting: 'Setting',
      Account: 'Account',
      UserName: 'UserName',
      Avatar: 'Avatar',
      About: 'About',
      'Add a comment': 'Add a comment',
      'Reply success': 'Reply success',
      'Reply failed': 'Reply failed',
      'Change Avatar': 'Change Avatar',
      'Privacy Policy': 'Privacy Policy',
      'Content Policy': 'Content Policy',
      'User Agreement': 'User Agreement',
      'Sign Out': 'Sign Out',
      'Post success': 'Post success',
      'Post failed': 'Post failed',
      'Please fill in the title': 'Please fill in the title',
      'Please fill in the content': 'Please fill in the content',
      'Please select a category': 'Please select a category',
      'No more than 9 pictures': 'No more than 9 pictures',
      'No more than 3 pictures': 'No more than 3 pictures',
      'Do you want to remove this picture?':
        'Do you want to remove this picture?',
      'Sign In': 'Sign In',
      'No data': 'No data',
      'Loading more...': 'Loading more...',
      'Reply to this post': 'Reply to this post',
      'What do you want to say?': 'What do you want to say?',
      'Select Category': 'Select Category',
      'No selected': 'No selected',
      'Sign in success': 'Sign in success',
      'Sign In with Email': 'Sign In with Email',
      'Failed to upload avatar': 'Failed to upload avatar',
      'Upload avatar success': 'Upload avatar success',
      'Delete Account': 'Delete Account',
      'Are you sure you want to delete your account?':
        'Are you sure you want to delete your account?',
      'Dangerous action': 'Dangerous action',
      'This operation is sensitive and requires recent authentication. Please sign in again to delete your account.':
        'This operation is sensitive and requires recent authentication. Please sign in again to delete your account.',
    },
  },
  zh: {
    translation: {
      Home: '首页',
      Publish: '发布',
      Notification: '通知',
      Recent: '最新',
      Popular: '热门',
      Cancel: '取消',
      OK: '确定',
      Publishing: '发布中',
      Title: '标题',
      Email: '邮箱',
      Password: '密码',
      Success: '成功',
      Error: '错误',
      Delete: '删除',
      Setting: '设置',
      Account: '账户',
      UserName: '用户名',
      Avatar: '头像',
      About: '关于',
      'Add a comment': '添加评论',
      'Reply success': '回复成功',
      'Reply failed': '回复失败',
      'Change Avatar': '更换头像',
      'Privacy Policy': '隐私政策',
      'Content Policy': '内容政策',
      'User Agreement': '用户协议',
      'Sign Out': '退出',
      'Post success': '发布成功',
      'Post failed': '发布失败',
      'Please fill in the title': '请填写标题',
      'Please fill in the content': '请填写内容',
      'Please select a category': '请选择分类',
      'No more than 9 pictures': '最多上传9张图片',
      'No more than 3 pictures': '最多上传3张图片',
      'Do you want to remove this picture?': '确定要删除这张图片吗？',
      'Sign In': '登录',
      'No data': '暂无数据',
      'Loading more...': '加载中...',
      'Reply to this post': '回复这条帖子',
      'What do you want to say?': '你想说点什么？',
      'Select Category': '选择分类',
      'No selected': '未选择',
      'Sign in success': '登录成功',
      'Sign In with Email': '邮箱登录',
      'Failed to upload avatar': '上传头像失败',
      'Upload avatar success': '上传头像成功',
      'Delete Account': '删除账户',
      'Are you sure you want to delete your account?': '确定要删除你的账户吗？',
      'Dangerous action': '危险操作',
      'This operation is sensitive and requires recent authentication. Please sign in again to delete your account.':
        '此操作很敏感，需要最近的身份验证。请重新登录以删除您的帐户。',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en',
    // lng: 'zh',
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

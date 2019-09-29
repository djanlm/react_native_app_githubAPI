import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default function Repository({ navigation }) {
  const repository = navigation.getParam('repository');

  return <WebView source={{ uri: repository.html_url }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  // navigation vem no props.navigation
  title: navigation.getParam('repository').name,
});

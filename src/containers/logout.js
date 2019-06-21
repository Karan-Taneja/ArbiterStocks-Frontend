import React from 'react';
import firebase from '../firebase';
import { Redirect } from 'react-router-dom';

// ---- Components
import Loading from '../components/loading';

// ---- Scripts
import appCache from '../scripts/cache';

export default class Logout extends React.Component {
  componentDidMount() {
    firebase.auth().signOut();
    appCache.removeItem('user');
    appCache.removeItem('portfolio')
  };
  render() {
    const user = appCache.getItem('user');
    return user ? <Loading /> : <Redirect to="/login" />
  }
};
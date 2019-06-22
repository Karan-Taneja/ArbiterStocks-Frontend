import React from 'react';
import firebase from '../firebase';
import { Redirect } from 'react-router-dom';

// ---- Components
import Loading from '../components/loading';

// ---- Contexts
import AuthContext from '../contexts/auth';

// ---- Scripts
import appCache from '../scripts/cache';

export default class Logout extends React.Component {
  static contextType = AuthContext;
  componentDidMount() {
    console.log('logging out');
    appCache.removeItem('user');
    appCache.removeItem('portfolio');
    this.context.update(null);
    firebase.auth().signOut();
  };
  render() {
    const user = appCache.getItem('user');
    return user ? <Loading /> : <Redirect to="/login" />
  };
};
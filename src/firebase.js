import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyByEyZz2vjAt6lTvNNRuKkpnYYQsLDbOv0",
  authDomain: "ttps-fs.firebaseapp.com",
  databaseURL: "https://ttps-fs.firebaseio.com",
  projectId: "ttps-fs",
  storageBucket: "ttps-fs.appspot.com",
  messagingSenderId: "791813225929",
  appId: "1:791813225929:web:353348dc47d820ad"
};

app.initializeApp(config);

export default app;
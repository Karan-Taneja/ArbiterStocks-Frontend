import React from 'react';
import firebase from '../firebase';
import axios from 'axios';
import AuthContext from '../contexts/auth';
import { Link, Redirect } from 'react-router-dom'

// ---- Components
import Loading from '../components/loading';

// ---- Scripts
import myEnv from '../scripts/vars';

// ---- CSS
import './form.css';

export default class Signup extends React.Component {

  static contextType = AuthContext;

  state = {
    email: '',
    password: '',
    confirm: '',
    error: '',
    loading: false,
  };

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading: true})
    const { email, password, confirm } = this.state;
    if(password === confirm){
      axios.post(`${myEnv.BASE_URL}/users/`, {
        email: `${email}`
      })
      .then(() => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
      })
      .then(() => {
        this.setState({loading: false});
      })
      .catch(err => {
        let { message } = err;
        if(message === "The email address is badly formatted.") message = "Invalid email address.";
        this.setState({ error: message, loading: false });
      });
    }
    else{
      this.setState({ error: 'The passwords do not match.', loading: false});
    };
  };

  render() {
    const { email, password, confirm, error, loading } = this.state;
    
    const displayError = error === '' ? 
    <div style={{height: '4em'}}></div> 
    : 
    (<div className="d-flex justify-content-center mx-n3" style={{height: '4em', marginBottom: 'none'}}>
      <div className="alert alert-danger col-12 text-center" role="alert">
        {error}
      </div>
    </div>);

    const displayForm = <div className="d-flex flex-wrap justify-content-center align-items-center">
      <div className="col-12">
        <form style={{margin: '0 auto'}} className="formBox col-sm-12 col-md-6 py-4 px-3">
          <h1 className="col-12 formHeader text-center">Sign Up</h1>
          {displayError}
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Email" name="email" value={email} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" placeholder="Password" value={password} name="password" onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputConfirmPassword1">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm Password" value={confirm} name="confirm" onChange={this.handleChange} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span>Already have an account?</span>
              <Link to="/login" className="px-1">Login</Link>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>;

    return (
      <AuthContext.Consumer>
        {
          (context) => {
            if (context.user) {
              return <Redirect to='/' />;
            } else {
              return loading ? <Loading /> :  displayForm;
            };
          }
        }
      </AuthContext.Consumer>
    );
  };
};
import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import firebase from './firebase';

// ---- Modules
import axios from 'axios';

// ---- Pages
import Signup from './containers/signup';
import Login from './containers/login';
import Logout from './containers/logout';
import Portfolio from './containers/portfolio';
import Transactions from './containers/transactions';

// --- Components
import Navbar from './components/navbar';
import Error404 from './components/error404';
import Loading from './components/loading';

// ---- Contexts
import AuthContext from './contexts/auth';
import StockContext from './contexts/stock';

// ---- Scripts
import appCache from './scripts/cache';
import myEnv from './scripts/vars';

// ---- CSS
import './App.css'

export default class App extends Component {
  state = {
    user: appCache.getItem('user'),
    stocks: appCache.getItem('stocks'),
    loading: true,
  };

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if(user){
        try {
          const res = await axios.get(`${myEnv.BASE_URL}/users/?email=${user.email}`);
          user.id = res.data.user.id;
          user.funds = res.data.user.funds;
          appCache.setItem('user', user);
          this.setState({user, loading: false});
          if(!this.state.stocks || Date.now() - this.state.stocks.updated * 1 > 43200000){
            try{
              const stockRes = await axios.get(`${myEnv.BASE_URL}/stocks/alldata`);
              const stocks = stockRes.data.stocks;
              stocks.update = Date.now()
              appCache.setItem('stocks', stocks);
              this.setState({stocks});
            }
            catch(err) {
              console.log(err)
              this.setState({stocks: null});
            };
          };
        }
        catch (err) {
          console.log(err);
          this.setState({user: null, stocks: null, loading: false});
        };
      }
      else{
        appCache.removeItem('user');
        this.setState({user:null, stocks:null, loading: false});
      };
    });
  };

  updateContext = (user) => {
    this.setState({'user': user}, () => {
      console.log(this.state.user);
    });
  };

  componentWillUnmount() {
    appCache.removeItem('user');
    this.unsubscribe();
  };

  render() {
    return (<>
      {
      <HashRouter>
        <AuthContext.Provider value={{user: this.state.user, update: this.updateContext}}>
          <Route path='/' component={ Navbar } />
          { this.state.loading ?
            <div className="container mt-5">
              <Loading />
            </div>
            :
            <div className='container mt-5'>
              <StockContext.Provider value={ this.state.stocks }>
                <Switch>
                  <Route path='/' exact component={ () => <Redirect to="/portfolio"/> } />
                  <Route path='/portfolio' exact component={ Portfolio } />
                  <Route path='/transactions' exact component={ Transactions } />
                  <Route path='/signup' exact component={ Signup } />
                  <Route path='/login' exact component={ Login } />
                  <Route path='/logout' exact component={ Logout } />
                  <Route component={ Error404 } />
                </Switch>
              </StockContext.Provider>
            </div>
          }
        </AuthContext.Provider>
      </HashRouter>
      }
    </>);
  };
};

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/auth';

// ---- Components
import Logo from '../assets/ArbiterStocks.svg';

// ---- Scripts
import format from '../scripts/format';

// ---- CSS
import './navbar.css';

// ---- Inline Styling
const dark = { color: '#6C757D'};
const underline = { color: '#FFF', borderBottom: '4px solid #3198F7'};

class Navbar extends Component {
  render(){
    return (
      <AuthContext.Consumer>
        {
          context => {
            const loggedOut = (
              <div className="navbar py-0 navbar-dark dark-bg justify-content-between">
                {
                  <Link to="#" className="navbar-brand">
                    <img src={Logo} alt="Arbiter Stocks" style={{width:'2rem','height':'auto'}}/>
                  </Link>
                }
                <div className="d-flex">
                  {
                    this.props.location.pathname === "/signup" ?
                    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/signup">Sign Up</Link>
                    :
                    <Link style={dark} className="nav-item nav-link" to="/signup">Sign Up</Link>
                  }
                  {
                    this.props.location.pathname === "/login" ?
                    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/login">Login</Link>
                    :
                    <Link style={dark} className="nav-item nav-link" to="/login">Login</Link>
                  }
                </div>
              </div>
              );
          
              const loggedIn = (
              <nav className="navbar py-0 navbar-dark dark-bg justify-content-between">
                <div className="d-flex">
                  <Link to="#" className="navbar-brand">
                    <img src={Logo} alt="Arbiter Stocks" style={{width:'2rem','height':'auto'}}/>
                  </Link>
                  {
                  this.props.location.pathname === "/portfolio" ?
                    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/portfolio">Portfolio</Link>
                    :
                    <Link style={dark} className="nav-item nav-link" to="/portfolio">Portfolio</Link>
                  }
                  {
                    this.props.location.pathname === "/transactions" ?
                    <Link style={{...dark, ...underline}} className="nav-item nav-link" to="/transactions">Transactions</Link>
                    :
                    <Link style={dark} className="nav-item nav-link" to="/transactions">Transactions</Link>
                  }
                </div>
                <div className="d-flex" style={dark}>
                { context.user ? <>
                      <div className="pr-1">
                        {context.user.email}
                      </div> 
                      | 
                      <div className="pl-1">
                        {format.returnFormatted('USD', context.user.funds)}
                      </div>
                      </>
                    :
                    <></>
                }
                </div>
                <div className="d-flex">
                  <Link style={dark} className="nav-item nav-link" to="/logout">Logout</Link>
                </div>
              </nav>
              );
              
              return context.user ? loggedIn : loggedOut;

          }
        }
      </AuthContext.Consumer>
    );
  };
};

export default Navbar;
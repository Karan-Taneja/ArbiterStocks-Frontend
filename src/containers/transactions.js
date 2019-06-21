import React from 'react';
import AuthContext from '../contexts/auth';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

// ---- Components
import TransactionTable from '../components/transactionTable';
import Loading from '../components/loading';

// ---- Scripts

export default class Transactions extends React.Component {
  
  static contextType = AuthContext;
  
  state = { 
    user: this.context.user,
    transactions: [],
    loading: true,
  };

  componentDidMount() {
    const user = this.state.user;
    if(user !== null){
      this.getUserTransactions(user.id);
    }
    else{
      this.setState({loading: false});
    };
  };

  getUserTransactions = async (user_id) => {
    try {
      const res = await axios.get(`https://arbiter-stocks.herokuapp.com/transactions/?user_id=${user_id}`)
      const { transactions } = res.data;
      if(transactions.length > 0){
        for(let i = 0; i < transactions.length; i++){
          const nextRes = await axios.get(`https://arbiter-stocks.herokuapp.com/stocks/id/${transactions[i].stock_id}`)
          let { stock } = nextRes.data;
          transactions[i].symbol = stock.symbol;
          transactions[i].company = stock.company;
          transactions[i].currency = stock.currency;
        };
        this.setState({ transactions: transactions, loading: false });
      }
      else {
        this.setState({ transactions : [], loading: false});
      };
    }
    catch(err) {
      console.log('err', err);
    };
  };

  render() {
    const { transactions, loading } = this.state;
    return (
      <AuthContext.Consumer>
        {
          context => {
            if(context.user){
              if(loading) return <Loading />
              else return (<div className="transactions">
                <TransactionTable transactions={transactions}/>
              </div>)
            }
            else{
              return <Redirect to="/login" />
            };
          }
        }
      </AuthContext.Consumer>  
    );
  };
};
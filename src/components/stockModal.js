import React, { Component } from 'react';
import axios from 'axios';

// ---- Components
import Loading from './loading';

// ---- Contexts
import AuthContext from '../contexts/auth';

// ---- Scripts
import iexReqs from '../scripts/iex';
import appCache from '../scripts/cache';
import format from '../scripts/format';

// ---- Assets
import Close from '../assets/close.svg';
import Back from '../assets/arrow_back.svg';

// ---- CSS
import './stockModal.css';

class StockModal extends Component {
  
  static contextType = AuthContext;

  state = {
    user: this.context.user,
    stocks: appCache.getItem('stocks'),
    portfolio: this.props.portfolio,
    symbol: '',
    displayList: [],
    quantity: '',
    currency: null,
    open_price: null,
    price: null,
    total: null,
    err: '',
    success: '',
    loading: false,
  };

  getStockPrice = async () => {
    const { stocks, symbol } = this.state;
    try{
      const initialRes = await iexReqs.getStockPrice(symbol);
      const open_price = stocks[symbol].open_price;
      const currency = stocks[symbol].currency;
      this.setState({
        price: initialRes.data, 
        displayList: [], 
        open_price, 
        currency, 
        err:'', 
        success: '',
        loading: false,
      })
    }
    catch(err){
      console.log(err);
    }
    this.pingStockPrice = setInterval(async () => {
      try {
        const res = await iexReqs.getStockPrice(symbol);
        this.setState({price: res.data, err: '', success: '', loading: false})
      }
      catch(err) {
        console.log(err)
      }
    }, 60000);
  };

  handleSymbolSubmit = (e) => {
    e.preventDefault();
    this.setState({loading: true})
    const { symbol, stocks } = this.state;
    const pass = stocks[symbol];
    if(pass) this.getStockPrice();
    else this.setState({
      err: 'The selected symbol is invalid.',
      loading: false,
    });
  };

  handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value.toUpperCase();
    if(value === '') this.setState({[name]: value, displayList:[]});
    else if(name === "symbol") {
      const { stocks } = this.state;
      const displayList = [];
      for(let stock in stocks){
        if(displayList.length >= 3) break;
        if(stock.indexOf(value) === 0) displayList.push(stock);
      };
      this.setState({[name]: value, displayList, err: '', success: '', loading: false});
    }
    else this.setState({[name]: e.target.value, err: '', success: '', loading: false});
  };

  handleQuantity = (e) => {
    e.preventDefault();
    let value = Math.floor(parseInt(e.target.value));
    if(value < 0) return;
    if(isNaN(value)) {
      value = '';
      this.setState({'quantity': value, total: 0, loading: false,});
    }
    else {
      const { price } = this.state;
      const nuTotal =  value * price;
      this.setState({'quantity':value, 'total': nuTotal, err: '', success: '', loading: false});
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    const symbol = e.target.getAttribute('value');
    const displayList = [];
    this.setState({symbol, displayList, err: '', success: '', loading: false});
  };

  handlePurchase = async (e) => {
    e.preventDefault();
    this.setState({loading: true});
    const { user, quantity, stocks, price, total, symbol, portfolio } = this.state;
    if(user.funds < total) {
      this.setState({'err': 'Insufficient funds', loading: false})
      return;
    }
    else if(quantity === 0) return;
    else{
      const funds = user.funds - total;
      let owned = false;
      let equity = 0;
      for(let item of portfolio){
        if(item.symbol === symbol) {
          owned = true;
          equity = item.quantity; 
          break;
        };
      };
      if(!user.id || !quantity || !price || !stocks[symbol].id || funds == null){
        this.setState({'err': 'An error occured. Please try again.'})
      }
      else {    
        try{
          await axios.post(`https://arbiter-stocks.herokuapp.com/transactions/?user_id=${user.id}`, {
            'stock_id': stocks[symbol].id,
            'quantity': quantity,
            'price_per_stock': price,
          });
          if(owned){
            const sum = quantity+equity;
            await axios.put(`https://arbiter-stocks.herokuapp.com/portfolios/`, {
              'user_id': user.id,
              'stock_id': stocks[symbol].id,
              'quantity': sum,
            });;
          }
          else{
            await axios.post(`https://arbiter-stocks.herokuapp.com/portfolios/`, {
              'user_id': user.id,
              'stock_id': stocks[symbol].id,
              'quantity': quantity,
            });
          }
          await axios.put(`https://arbiter-stocks.herokuapp.com/users/?email=${user.email}`, {
            'funds': funds
          });
        }
        catch(err) {
          console.log(err);
          this.setState({err: 'An error occured. Please try again.', loading: false});
          return;
        };
        user.funds = funds;
        clearInterval(this.pingStockPrice);
        this.setState({
          user: user,
          success: 'Transaction successfully completed.', 
          err: '',
          loading: false,
        });
      };
    };
  };

  getUserInformation = async (user) => {
    if(!user || !user.email) return;
    const res = await axios.get(`https://arbiter-stocks.herokuapp.com/users/?email=${user.email}`);
    user.id = res.data.user.id;
    user.funds = res.data.user.funds;
  };

  componentDidMount(){
    const user = this.context.user;
    if(user && !user.funds){
      this.getUserInformation(user);
    };
  };
  
  componentWillUnmount(){
    clearInterval(this.pingStockPrice);
  };

  handleReturn = () => {
    clearInterval(this.pingStockPrice);
    this.setState({
      price: null, 
      open_price: null, 
      total: null, 
      currency: null,
      success: '',
      symbol: '',
      err: '',
      loading: false,
    });
  };

  render(){
    const { user, symbol, displayList, stocks, quantity, loading,
            currency, open_price, price, total, err, success } = this.state;
    let f_open_price, f_price, f_total, f_funds;
    if(user){
      if(currency && price && open_price){
        f_total = total ? format.returnFormatted(currency, total) : total;
        f_price = price ? format.returnFormatted(currency, price) : price;
        f_open_price = open_price ? format.returnFormatted(currency, open_price) : open_price;
      };
      if(user.funds){
        let funds = user.funds;
        f_funds = user.funds ? format.returnFormatted('USD', funds) : user.funds;
      };
    };
    const displayError = (err === '' ?
    <div style={{height: '4em'}}></div> 
    : 
    <div className="d-flex justify-content-center mx-n3" style={{height: '4em', marginBottom: 'none'}}>
      <div className="alert alert-danger col-12 text-center" role="alert">
        {err}
      </div>
    </div>);

    const displaySuccess = (success === '' ?
    <div style={{height: '4em'}}></div> 
    : 
    <div className="d-flex justify-content-center mx-n3" style={{height: '4em', marginBottom: 'none'}}>
      <div className="alert alert-success col-12 text-center" role="alert">
        {success}
      </div>
    </div>
    )

    return (
    <div className="blackdrop" onClick={this.props.toggle} value={true}>
      <div className="modalBox">
        <form className="px-3 col-12 position-relative" style={{height: '100%'}}>
          <div className="position-absolute" style={{width:'1rem','height':'1rem', top: '10px', right: '15px', zIndex: 101}} 
          onClick={this.props.toggle} value={true}>
            <img src={Close} alt="Close" value={true} style={{height: '1rem', width: '1rem'}}/>
          </div>
          {
            !this.state.price ?
            <h1 className="modalHeader col-12 text-center pt-2">Select Stock</h1>
            :
            <h1 className="modalHeader col-12 text-center pt-2">{stocks[symbol].company} Stock</h1>
          }
          { loading ? <Loading /> : success === '' ? displayError : displaySuccess }
          {
            !this.state.price ?
            <>
            <div className="form-group position-relative">
              <label htmlFor="exampleInputSymbol1">Stock Symbol</label>
              <input type="text" autoComplete="off" className="form-control" placeholder="Stock Symbol" value={symbol} name="symbol" onChange={this.handleChange} />
              <div className="position-absolute" style={{width: '100%', zIndex: '101'}}>
                {displayList.map((e, i) => {
                  return <div className="form-control" name={symbol} value={e} key={i} onClick={this.handleClick}>{e}</div>
                })}
              </div>
            </div>
            <div className="col-12 d-flex justify-content-end px-0">
              <button type="submit" className="btn btn-primary" onClick={this.handleSymbolSubmit}>Submit</button>
            </div> 
            </>
            :
            <div>
              <h1 className="col-12 text-center">{symbol}</h1>
              <div className="d-flex justify-content-center" style={{width: '100%'}}>
                <div className="col-6 text-center">
                  <label>Available Funds</label>
                  <h3 className="prices profit">{f_funds}</h3>
                </div>
              </div>
              <div className="d-flex px-0" style={{width: '100%'}}>
                <div className="col-3 text-center">
                  <label>Open Price</label>
                  <div className="prices">{f_open_price}</div>
                </div>
                <div className="col-3 text-center"> 
                  <label>Price</label>
                  <div className="prices">{f_price}</div>
                </div>
                <div className="form-group col-3 text-center">
                  <label>Quantity</label>
                  <input type="number" autoComplete="off" className="form-control inputField text-center" placeholder="0" value={quantity} name="quantity" onChange={this.handleQuantity} />
                </div>
                <div className="text-center col-3">
                  <label>Total</label>
                  <div className="prices">{f_total || '$0'}</div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-between px-0">
                <img src={Back} alt="Back" style={{color: 'blue', width:'3rem','height':'3rem'}} onClick={this.handleReturn}/>
                <button className="btn btn-primary" onClick={this.handlePurchase}>Purchase</button>
              </div> 
            </div> 
          }
        </form>
      </div>
    </div>
    );
  };
};

export default StockModal;
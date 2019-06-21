import React from 'react';
import './table.css';

// ---- Scripts
import format from '../scripts/format';

export default (props) =>  { 
  const { portfolio } = props;
  return (<>
    {
      portfolio.length > 0 ? (
      <>
      <div className="portfolio-table table d-flex flex-wrap justify-content-center col-12">
        <div className="row col-12 justify-content-center flex-nowrap">
          <div className="name-column number col-1 text-left align-middle py-2">#</div>
          <div className="name-column symbol col-2 text-left align-middle py-2">Symbol</div>
          <div className="name-column company col-3 text-left align-middle py-2">Company</div>
          <div className="name-column amount col-3 text-left align-middle py-2">Quantity</div>
          <div className="name-column value col-3 text-left align-middle py-2">Value</div>
        </div>
        { 
          portfolio.map((e, i) => {
          const curr = e.quantity * e.price;
          const start = e.quantity * e.open_price;
          const value = format.returnFormatted(e.currency, (e.quantity * e.price));
          const bg = (i+1) % 2 === 0 ? 'even' : 'odd'
          const color = curr > start ? 'profit' : curr === start ? '' : 'loss';
          const op = color === 'profit' ? '+' : color === 'loss' ? '-' : '';
          const val = curr > start ? (1 - start/curr) : (1 - curr/start)
          const difference = `${op}${(val * 100).toFixed(2)}%`;
          
          let row = (
          <div className='stock-row row col-12 justify-content-center flex-nowrap' key={i}>
            {
              i === portfolio.length - 1 ?
              <div className={`${bg} stock-column number col-1 text-left align-middle bblr py-2`}>{i+1}</div>
              :
              <div className={`${bg} stock-column number col-1 text-left align-middle py-2`}>{i+1}</div>
            }
            <div className={`${bg} stock-column symbol col-2 text-left align-middle py-2`}>{e.symbol}</div>
            <div className={`${bg} stock-column company col-3 text-left align-middle py-2`}>{e.company}</div>
            <div className={`${bg} stock-column quantity col-3 text-left align-middle py-2`}>{e.quantity}</div>
            {
              i === portfolio.length - 1 ?
              <div className={`${bg} stock-column value col-3 text-left align-middle bbrr py-2 ${color}`}>{value} ({difference})</div>
              :
              <div className={`${bg} stock-column value col-3 text-left align-middle py-2 ${color}`}>{value} ({difference})</div>
            }
          </div>);
          return row;
        }) }
      </div>
      </>
      )
      :
      <div className="alert alert-light row col-12">You have no stocks</div>
    }
  </>)
};
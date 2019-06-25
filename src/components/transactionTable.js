import React from 'react';
import moment from 'moment';

// ---- Scripts
import format from '../scripts/format';

// ---- CSS
import './table.css';

export default (props) => {
  const { transactions } = props;
  return (<>
    {
      transactions.length > 0 ? (
      <>
      <div className="transactions-table table d-flex flex-wrap col-12">
        <div className="row col-12 justify-content-center flex-nowrap">
          <div className={`name-column number col-1 text-left py-2`}>#</div>
          <div className={`name-column symbol col-1 text-left py-2`}>Symbol</div>
          <div className={`name-column company col-2 text-left py-2`}>Company</div>
          <div className={`name-column amount col-1 text-left py-2`}>Amount</div>
          <div className={`name-column perstock col-2 text-left py-2`}>Per Stock</div>
          <div className={`name-column total col-2 text-left py-2`}>Total</div>
          <div className={`name-column date col-3 text-left py-2`}>Date</div>
        </div>
        {transactions.map((e, i) => {
          const date = moment(e.transaction_date).format('LLL')
          const perstock = format.returnFormatted(e.currency, e.price_per_stock);
          const total = format.returnFormatted(e.currency, e.total_price);
          const bg = (i+1) % 2 === 0 ? 'even' : 'odd'
          
          let row = (<div className={`row col-12 justify-content-center flex-nowrap`} key={i}>
            {
              i === transactions.length - 1 ?
              <div className={`stock-column number col-1 text-left py-2 bblr ${bg}`}>{i+1}</div>
              :
              <div className={`stock-column number col-1 text-left py-2 ${bg}`}>{i+1}</div>
            }
            <div className={`stock-column symbol col-1 text-left py-2 ${bg}`}>{e.symbol}</div>
            <div className={`stock-column company col-2 text-left py-2 ${bg}`}>{e.company}</div>
            <div className={`stock-column amount col-1 text-left py-2 ${bg}`}>{e.quantity}</div>
            <div className={`stock-column perstock col-2 text-left py-2 ${bg}`}>{perstock}</div>
            <div className={`stock-column total col-2 text-left py-2 ${bg}`}>
              {e.transaction_type === 'buy' ? `-${total}`: `+${total}`}
            </div>
            {
              i === transactions.length - 1 ?
              <div className={`stock-column date col-3 text-left py-2 bbrr ${bg}`}>{date}</div>
              :
              <div className={`stock-column date col-3 text-left py-2 ${bg}`}>{date}</div>
            }
          </div>);
          return row;
        })}
      </div>
      </>
      )
      :
      <div className="alert alert-light row col-12">You have no stocks</div>
    }
  </>)
};
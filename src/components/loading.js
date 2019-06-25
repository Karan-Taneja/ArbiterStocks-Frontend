import React from 'react';
import Loader from '../assets/loader.svg';
import './loading.css';

export default (props) => {
  return (<div className="loading-box">
    <div>
      <img src={Loader} alt="loading..." style={{width: props.width || '200px','height':'auto'}}/>
    </div>
  </div>);
};
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

WebViewJavascriptBridge.init();

ReactDOM.render(<App />, document.getElementById('root'));


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from './redux/createStore';


import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> {/* Provider make redux store effect on all app  */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


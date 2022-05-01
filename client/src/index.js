import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './app/store';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

window.API_BASE_ADDRESS = `https://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`;

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/">
      <SnackbarProvider maxSnack={3} preventDuplicate>
        <Provider store={store}>
          <App/>
        </Provider>
      </SnackbarProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

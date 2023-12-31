import { AppThemeProvider } from './themes/AppThemeProvider';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import './main.css';

ReactDOM.render(
  <React.StrictMode>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

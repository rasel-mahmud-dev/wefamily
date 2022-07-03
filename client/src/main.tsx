import React from 'react'

import App from './App'

import { createRoot } from 'react-dom/client'
import store from "store/index"
import { Provider } from  "react-redux"
import {BrowserRouter, HashRouter} from "react-router-dom";

import './index.css'


createRoot(
  document.getElementById('root') as HTMLDivElement
)
  .render(<HashRouter>
  <Provider store={store}>
    <App />
  </Provider>
</HashRouter>,)

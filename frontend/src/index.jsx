import './styles/main.scss';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from './routes';

if (module && module.hot) module.hot.accept(); // starts Webpack HMR

// process images for Favorite icons
require.context('./images/favicons', true);

// Get query params from url
const getQueryParams = (parameter) => {
  let param;
  const query = window.location.search.substring(1);
  const params = query.split('&');
  const result = params.map((item) => {
    const pair = item.split('=');
    if (pair[0] === parameter) return pair[1];
    return false;
  });

  result.forEach((res) => {
    if (res) param = res;
  });

  return param;
};

// try to get user language
const getLanguage = () => {
  const available = ['pt', 'en', 'he'];
  const { DEFAULT_LANG } = process.env || 'en';
  const browserLang = window.navigator.userLanguage || window.navigator.language;
  const lang = (`${browserLang[0]}${browserLang[1]}`).toLowerCase();
  const local = localStorage.getItem('lang');
  const queryLang = getQueryParams('lang');
  const language = local || queryLang
  || (available.includes(lang) && lang) || DEFAULT_LANG;

  localStorage.setItem('lang', language);
};

getLanguage();

render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);

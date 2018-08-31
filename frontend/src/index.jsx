import './styles/main.scss';
import React from 'react';
import { render } from 'react-dom';
import Home from './components/Home/Home';

if (module && module.hot) module.hot.accept(); // starts Webpack HMR

// process images for Favorite icons
require.context('./images/favicons', true);

render(
  <Home />,
  document.getElementById('root'),
);

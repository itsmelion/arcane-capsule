import './styles/main.scss';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Video from './components/Video/Video';

if (module && module.hot) module.hot.accept(); // starts Webpack HMR

// process images for Favorite icons
require.context('./images/favicons', true);

render(
  <BrowserRouter>
    <div flex="" fill="">
      <Route exact path="/" component={Home} />
      <Route exact path="/video/:id" component={Video} />
    </div>
  </BrowserRouter>,
  document.getElementById('root'),
);

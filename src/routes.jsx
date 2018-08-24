import React from 'react';
import Loadable from 'react-loadable';
import Home from './Home/Home';

const loading = () => (
  <div flex="grow" align="center center" className="fill row">
    <h3><b className="pulse">Loading...</b></h3>
  </div>
);

const Page = Loadable({
  loader: () => import('./AnotherRoute.jsx'),
  loading,
});

export { loading, Home, Page };

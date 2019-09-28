import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// import Main from './pages/Main';
import MarkerInfoWindow from './pages/MarkerInfoWindow';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={MarkerInfoWindow} />
        <Route path="/marker" component={MarkerInfoWindow} />
      </Switch>
    </BrowserRouter>
  );
}

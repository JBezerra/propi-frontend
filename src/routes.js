import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import ConsultList from './pages/ConsultList'
import ConsultForm from './pages/ConsultForm'

import './services/googleAnalytics'

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={ConsultForm} />
      <Route path="/consult" component={ConsultList} />
    </BrowserRouter>
  );
}

export default Routes;
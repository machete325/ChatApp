import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';

const App = () => {
  return (
    <div className="wrapper">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Chat />
        </Switch>
      </Router>
    </div>
  );
};

export default App;

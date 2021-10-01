import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';

const App = () => {
  const user = localStorage.getItem('user');

  return (
    <div className="wrapper">
      <Router>
        <Switch>
          <Route exact path="/">
            {/* {user ? <Redirect to="/chat" /> : <Home />} */}
            <Home />
          </Route>
          <Route path="/chat">{!user ? <Redirect to="/" /> : <Chat />}</Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;

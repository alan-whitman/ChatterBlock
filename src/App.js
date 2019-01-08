import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/Landing/landing';
import Dashboard from './components/Dashboard/dashboard';
import './reset.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Route path="/" render={(props) => {
          return (
            <div className="App">   
            <Switch>
              <Route path="/" exact component={Landing}/>
              <Route path="/dashboard" component={Dashboard}/>
            </Switch>
          </div>    
          )
          }}/>
      </HashRouter>
    );
  }
}

export default App;

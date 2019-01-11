import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/Landing/landing';
import Dashboard from './components/Dashboard/dashboard';
import { connect } from 'react-redux';
import { userLoggedIn } from './redux/reducer';
import './reset.css';
import './App.css';
import axios from 'axios';

class App extends Component {
  componentDidMount() {
    axios.get('/auth/currentUser').then(res => {
      if (res.data)
        this.props.userLoggedIn(res.data);
    })
  }
  render() {
    return (
      <HashRouter>
        <Route path="/" render={(props) => {
          return (
            <div className="App">   
            <Switch>
              <Route path="/" exact component={Landing}/>
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </div>    
          )
          }}/>
      </HashRouter>
    );
  }
}

const mapStateToProps = state => {
  let { user, isAuthenticated } = state;
  return {
    user,
    isAuthenticated
  }
}

export default connect(mapStateToProps, {userLoggedIn})(App);

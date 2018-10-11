import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import My from './page/My';
import HomePage from './page/HomePage';
import Login from './page/Login';
import Home from "./page/Home";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            pathname: '/',
        }
    }

    componentDidMount() {
        window.onhashchange = () => {
            console.log(123);
            this.setState({
                pathname: window.location.pathname,
            })
        }
    }

    _tabBar = () => {
        if (window.location.pathname === '/My' || window.location.pathname === '/') {
            return (
                <ul className="Nav">
                    <li>
                        <Link to="/Login">
                            <div>
                                <FontIcon
                                    className="muidocs-icon-navigation-expand-more"
                                    style="width: 30px;height: 30px;"
                                />
                                <FlatButton className='NavBtn' label="Home" primary={true} style="height: 56px" />
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/My">
                            <FontIcon
                                className="muidocs-icon-action-home"
                            />
                            <FlatButton className='NavBtn' label="My" primary={true} />
                        </Link>
                    </li>
                </ul>
            );
        }
    }

  render() {
        console.log(this);
    return (
        <Router>
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-main">
                        <Switch>
                            <Route path="/Login" component={Login}/>
                            <Route exact path="/" component={Home}/>
                            <Route path="/My" component={My}/>
                        </Switch>
                    </div>
                    {this._tabBar()}
                </div>
            </MuiThemeProvider>
        </Router>
    );
  }
}

export default App;

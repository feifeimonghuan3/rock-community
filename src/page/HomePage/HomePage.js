import React, { Component } from 'react';
import '../../styles/My.css';
import {Link, Route, Switch, Redirect} from "react-router-dom";
import My from "../My";
import Home from "../Home";
import FontIcon from "material-ui/FontIcon/index";
import FlatButton from "material-ui/FlatButton/index";
import '../../styles/HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div class="HomePage">
                <div className="HomePage-main">
                    <Route exact path="/" component={Home}/>
                    <Route path="/MyPage" component={My}/>
                    {/*<Redirect to="/index" />*/}
                </div>
                <ul className="Nav">
                    <li>
                        <Link to="/">
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
                        <Link to="/MyPage">
                            <FontIcon
                                className="muidocs-icon-action-home"
                            />
                            <FlatButton className='NavBtn' label="My" primary={true} />
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default HomePage;

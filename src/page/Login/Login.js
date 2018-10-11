import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import '../../styles/Login.css';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import { setAccount } from '../../redux/Action'
import axios from 'axios';
import api from './../../api';
import { Map } from 'immutable';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: null,
            password: null,
            barState: false,
            msg: null,
        }
    }

    handleClick = () => {
        this.setState({
            barState: true,
        });
    };

    handleRequestClose = () => {
        this.setState({
            barState: false,
        });
    };

    render() {
        return (
            <div className="Login">
                <AppBar title={'登陆'} iconElementLeft={<IconButton>
                    <NavigationClose onClick={() => {
                        this.props.history.goBack();
                    }}
                    />
                </IconButton>} />
                <div class="Login-Main">
                    <Paper zDepth={2}>
                        <TextField hintText="账号" style={{marginLeft: 20,}}  underlineShow={false} onChange={(event, newValue) => {
                            this.setState({
                                userName: newValue,
                            })
                        }} />
                        <Divider />
                        <TextField hintText="密码" type="password" style={{marginLeft: 20,}}  underlineShow={false} onChange={(event, newValue) => {
                            this.setState({
                                password: newValue,
                            })
                        }}  />
                        <Divider />
                    </Paper>
                    <FlatButton class="login-Btn" rippleColor={'#FFF'} style={{marginTop: 150,}} label="注册" fullWidth={true} />
                    <FlatButton class="login-Btn" rippleColor={'#FFF'} style={{marginTop: 10,}} label="登陆" fullWidth={true} onClick={() => {
                        if (this.state.password === null || this.state.userName === null){
                            alert('不能为空');
                        }
                        const { setAccount, history } = this.props;
                        const { handleClick } = this;
                        const _this = this;
                        console.log(this.props);
                        axios.post(api.api + 'login', {
                            userName: this.state.userName,
                            password: this.state.password,
                        }).then(function (response) {
                            console.log(response);
                            if ( response.data.code === 201) {
                                let initialState = Map({
                                    userName: response.data.data.userName,
                                    uuid: response.data.data.uuid,
                                    permissions: response.data.data.permissions,
                                });
                                // Map.set('userName', response.data.data.userName);
                                // Map.set('uuid', response.data.data.uuid);
                                // Map.set('permissions', response.data.data.permissions);
                                setAccount(initialState);
                                _this.setState({
                                    msg: '登陆成功',
                                });
                                handleClick();
                                setTimeout(() => {
                                    history.goBack();
                                }, 2000)
                            } else {
                                _this.setState({msg: response.data.msg});
                                handleClick();
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                        // console.log(this.props);
                    }}/>
                </div>
                <Snackbar
                    open={this.state.barState}
                    message={this.state.msg}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {

}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setAccount(data) {
            dispatch(setAccount(data));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);

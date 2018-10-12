import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import '../../styles/Home.css';
import left from '../../resource/arrow-left2.svg';
import right from '../../resource/arrow-right2.svg';
import api from '../../api';
import { setDayList, setHomeMSG } from "../../redux/Action";
import Snackbar from "material-ui/Snackbar/index";
import Store from '../../redux/Store';
import TextField from 'material-ui/TextField';
import IconButton from "material-ui/IconButton/index";
import NavigationClose from "material-ui/svg-icons/navigation/close";


class Message extends Component {
    constructor(props) {
        super(props);
        moment.locale('zh-cn');
        const date = moment();
        this.dayList = []
        this.state = {
            date: date,
            year: date.year(),
            month: date.month() + 1,
            day: date.date(),
            stringDate: date.format('YYYY-MM-DD dddd'),
            orderList: null,
            timeArr: [],
            logged: false,
            rowNumberList: [],
            msgText: null,
        };
    }

    componentDidMount() {
        this._getCommunity();
        console.log(this.props.location.parse);
        setTimeout(() => {
            console.log(this.props);
        }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
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

    _submit = () => {
        const dayList = this.props.location.query.dayList;
        const homeMSG = Store.getState().getIn(['homeMSG']);
        if (dayList.length === 0) {
            this.setState({msg: '请选择时间'});
            this.handleClick();
            return false;
        }
        if (homeMSG === null) {
            this.setState({msg: '请填写备注'});
            this.handleClick();
            return false;
        }
        if (this.props.userName) {
            const _this = this;
            // const { dayList } = this.state;
            for (let i in dayList) {
                dayList[i] = dayList[i] + 9;
            }
            console.log(this.state.msgText);
            axios.post(api.api + 'addCommunity', {
                communityUserID: this.props.uuid,
                communityUseYear: this.state.year,
                communityUseMonth: this.state.month,
                communityUseDay: this.state.day,
                communityUseHour: dayList,
                note: homeMSG,
            }).then(function (response) {
                console.log(response);
                if ( response.data.code === 201) {
                    _this.setState({
                        msg: '预约成功',
                    });
                    _this.props.setHomeMSG(null);
                    _this.props.setDayList(null);
                    _this.handleClick();
                    _this._getCommunity();
                    setTimeout(()=>{
                        _this.props.history.goBack();
                    },500);
                } else {
                    _this.setState({msg: response.data.msg});
                    _this.handleClick();
                }
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            this.props.history.push('/Login');
        }
    }

    _getCommunity = () => {
        this.setState({
            timeArr: this._timeArr(),
        },() => {
            axios.get(api.api + 'getCommunity').then(response => {
                const list = response.data.data;
                const datalist = [];
                this.setState(previousState => {
                    const dateFormat = previousState.date.format('YYYY-MM-DD');
                    for (let i in list) {
                        if(dateFormat === list[i].text) {
                            datalist.push(list[i].communityUseHour);
                            const index = parseInt(list[i].communityUseHour) - 9;
                            previousState.timeArr[index].state = false;
                            previousState.timeArr[index].note = list[i].note;
                        }
                    }
                    return {
                        timeArr: previousState.timeArr,
                    }
                })
            }).then(error => {
            });

        })
    }

    _timeArr = () => {
        let start = 9;
        const end = 24;
        const timeArr = [];
        for(let i = start;i <= 24; i++){
            let timeObj = {
                text: `${start}:00-${start !== 24 ? start + 1 : '00'}:00`,
                date: start,
                state: true,
                note: '暂无预约',
            }
            timeArr.push(timeObj);
            start ++;
        }
        return timeArr;
    }

    _add = (num) => {

        const { date } = this.state;
        const dateAdd = date.add(num, 'day');
        this.setState({
            date: date,
            year: date.year(),
            month: date.month() + 1,
            day: date.date(),
            stringDate: date.format('YYYY-MM-DD dddd'),
        }, () => {
            this._getCommunity();
        });
        this.props.setDayList([]);
    }

    _AppBarRightRender = () => {
        return (
            <div>
                <FlatButton className={'appBar-right-btn'} rippleColor={'#FFF'} label={this.props.userName || '登陆'} onClick={() => {
                    this.props.history.push('/Login');
                }}/>
            </div>
        )
    }

    render() {
        const {
            year,
            month,
            day,
            stringDate,
            timeArr,
        } = this.state;
        return (
            <div className="Home">
                <AppBar title={'登陆'} iconElementLeft={<IconButton>
                    <NavigationClose onClick={() => {
                        this.props.history.goBack();
                    }}
                    />
                </IconButton>} />
                {this.props.location.query.dayList.map((v, i) => {
                    // return `${this.props.location.query.stringDate}${v}:00`;
                    const vu = v;
                    return (
                        <div>
                            {`${this.props.location.query.stringDate}${vu + 9}:00`}
                        </div>
                    );
                })}

                <div class="msgInput">
                    <TextField
                        hintText="备注"
                        fullWidth={true}
                        onChange={(event, newValue) => {
                            this.props.setHomeMSG(newValue);
                        }}
                    />
                    <FlatButton label={'确定'} fullWidth={true} backgroundColor={'rgb(0, 188, 212)'} rippleColor={'#FFF'} style={{marginTop: 20,marginBottom: 20,color: '#FFF'}} onClick={this._submit}/>
                </div>
                <Snackbar
                    open={this.state.barState}
                    message={this.state.msg}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
                {/*<Alert  open={this.state.AlertState} submit={this._submit} />*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userName: state.getIn(['account', 'userName']),
        uuid: state.getIn(['account', 'uuid']),
        // dayList: state.getIn(['dayList']),
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setDayList(data) {
            dispatch(setDayList(data));
        },
        setHomeMSG(data) {
            dispatch(setHomeMSG(data))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Message);

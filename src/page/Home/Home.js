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
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux'
import '../../styles/Home.css';
import left from '../../resource/arrow-left2.svg';
import right from '../../resource/arrow-right2.svg';
import api from '../../api';
import { setDayList, setHomeMSG } from "../../redux/Action";
import {Map} from "immutable";
import Snackbar from "material-ui/Snackbar/index";
import Store from '../../redux/Store';
import Alert from '../../component/Alert';

const Logged = (props) => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
    </IconMenu>
);

class Home extends Component {
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
        console.log(this.props);
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
        const dayList = Store.getState().getIn(['dayList']);
        const homeMSG = Store.getState().getIn(['homeMSG']);
        if (dayList.length === 0) {
            this.setState({msg: '请选择时间'});
            this.handleClick();
            return false;
        }
        // if (this.state.msgText === null) {
        //     this.setState({msg: '请填写备注'});
        //     this.handleClick();
        //     return false;
        // }
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
                note: '排练',
            }).then(function (response) {
                console.log(response);
                if ( response.data.code === 201) {
                    _this.setState({
                        msg: '预约成功',
                    });
                    this.props.setHomeMSG(null);
                    this.props.setDayList(null);
                    _this.handleClick();
                    this._getCommunity();
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
                <AppBar
                    title="时间表"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    iconElementRight={this._AppBarRightRender()}
                />
                <div class="pickDay">
                    <div>
                        <FlatButton onClick={() => {
                            this._add(-1);
                        }}>
                            <img src={left} alt=""/>
                        </FlatButton>
                    </div>
                    <div class="pickDay-day">{`${stringDate}`}</div>
                    <div><FlatButton onClick={() => {
                        this._add(1);
                    }}>
                        <img src={right} alt=""/>
                    </FlatButton></div>
                </div>
                <Table multiSelectable={true} onRowSelection={(rowNumber) => {
                    if (rowNumber.length === 0 ) {
                        return
                    }
                    let dayList = [];
                    if (rowNumber == 'all') {
                        for (let i in this.state.timeArr){
                            dayList.push(parseInt(i));
                        }
                    } else if(rowNumber === 'none') {
                        dayList = [];
                    } else {
                        dayList = rowNumber;
                    }
                    this.props.setDayList(dayList);
                }}
                    //    onCellClick={(rowNumber) => {
                    // const {timeArr} = this.state;
                    // timeArr[rowNumber].state = true;
                    // this.setState((previousState) => {
                    //     console.log(previousState.timeArr[rowNumber].state);
                    //     previousState.timeArr[rowNumber].state = previousState.timeArr[rowNumber].state ? false : true;
                    //     console.log(previousState.timeArr[rowNumber].state);
                    //     return {
                    //         timeArr: previousState.timeArr,
                    //     }
                    // })
                // }}
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>时间</TableHeaderColumn>
                            <TableHeaderColumn>状态</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timeArr.map( v => {
                            return (
                                <TableRow  selectable={v.state}>
                                    <TableRowColumn>{v.text}</TableRowColumn>
                                    <TableRowColumn>{v.note}</TableRowColumn>
                                </TableRow>
                            )
                        })}

                        {/*<TableRow>*/}
                            {/*<TableRowColumn>2</TableRowColumn>*/}
                            {/*<TableRowColumn>Randal White</TableRowColumn>*/}
                        {/*</TableRow>*/}
                        {/*<TableRow>*/}
                            {/*<TableRowColumn>3</TableRowColumn>*/}
                            {/*<TableRowColumn>Stephanie SandersStephanie SandersStephanie SandersStephanie Sanders</TableRowColumn>*/}
                        {/*</TableRow>*/}
                        {/*<TableRow>*/}
                            {/*<TableRowColumn>4</TableRowColumn>*/}
                            {/*<TableRowColumn>Steve Brown</TableRowColumn>*/}
                        {/*</TableRow>*/}
                        {/*<TableRow>*/}
                            {/*<TableRowColumn>5</TableRowColumn>*/}
                            {/*<TableRowColumn>Christopher Nolan</TableRowColumn>*/}
                        {/*</TableRow>*/}
                    </TableBody>
                </Table>
                <div class="msgInput">
                    <TextField
                        hintText="备注"
                        fullWidth={true}
                        onChange={(event, newValue) => {
                            this.props.setHomeMSG(newValue);
                        }}
                    />
                </div>
                <FlatButton label={'确定'} onClick={this._submit}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(Home);

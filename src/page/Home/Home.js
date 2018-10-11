import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import FontIcon from "material-ui/FontIcon/index";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import '../../styles/Home.css';
import left from '../../resource/arrow-left2.svg';
import right from '../../resource/arrow-right2.svg';
import api from '../../api';

class Home extends Component {
    constructor(props) {
        super(props);
        moment.locale('zh-cn');
        const date = moment();
        this.state = {
            date: date,
            year: date.year(),
            month: date.month() + 1,
            day: date.date(),
            stringDate: date.format('YYYY-MM-DD dddd'),
            orderList: null,
            timeArr: [],
        };
    }

    componentDidMount() {
        this._getCommunity();
        console.log(this.props);
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
                    console.log(rowNumber);
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
                                <TableRow selectable={v.state}>
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
                <FlatButton label={'确定'} onClick={() => {
                    this.props.history.push('path:Login');
                }}/>

            </div>
        );
    }
}

export default Home;

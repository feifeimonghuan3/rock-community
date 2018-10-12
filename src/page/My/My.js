import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import '../../styles/My.css';
import AppBar from "material-ui/AppBar/index";

class My extends Component {
    render() {
        return (
            <div class="My">
                <AppBar
                    title="我的"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                />
                <List>
                    <ListItem primaryText="我的预约" leftIcon={<ActionGrade />} onClick={() => {
                        alert(1);
                    }}/>
                    <ListItem primaryText="收件箱" leftIcon={<ContentInbox />} />
                    <ListItem primaryText="发邮件" leftIcon={<ContentSend />} />
                    <ListItem primaryText="草稿箱" leftIcon={<ContentDrafts />} />
                </List>
                <Divider />
                {/*<List>*/}
                    {/*<ListItem primaryText="All mail" rightIcon={<ActionInfo />} />*/}
                    {/*<ListItem primaryText="Trash" rightIcon={<ActionInfo />} />*/}
                    {/*<ListItem primaryText="Spam" rightIcon={<ActionInfo />} />*/}
                    {/*<ListItem primaryText="Follow up" rightIcon={<ActionInfo />} />*/}
                {/*</List>*/}
            </div>
        );
    }
}

export default My;

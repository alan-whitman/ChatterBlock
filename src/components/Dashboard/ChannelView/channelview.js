import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { populateChannelUsers } from '../../../redux/reducer';
import DateStamp from '../../DateFormat/dateStamp'
import './channelview.css';

class ChannelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            channelId: -1,
            messageInput: ''
        }
        this.messageWindowRef = React.createRef();
        this.props.socket.on('send initial response', initialResponse => {
            this.props.populateChannelUsers(initialResponse.users);
            this.setState({ messages: initialResponse.existingMessages, channelId: initialResponse.channelId, channelName: initialResponse.channelName });
        });
        this.props.socket.on('new message', newMessage => {
            let { messages } = this.state
            messages.push(newMessage);
            this.setState({ messages });
        });
        this.props.socket.on('user joined channel', user => {
            let channelUsers = [...this.props.channelUsers];
            if (channelUsers.findIndex(existingUser => existingUser.id === user.id) !== -1)
                return;
            channelUsers.push(user);
            channelUsers.sort((a, b) => a.username < b.username ? -1 : 1);
            this.props.populateChannelUsers(channelUsers);
        });
        this.props.socket.on('user left channel', username => {
            let channelUsers = [...this.props.channelUsers];
            channelUsers = channelUsers.filter(user => user.username !== username);
            this.props.populateChannelUsers(channelUsers);
        });
    }
    componentWillMount() {
        const { channelName } = this.props.match.params;
        this.props.socket.emit('join channel', channelName);
    }
    componentDidUpdate(prevProps) {

        if (prevProps.match.params.channelName !== this.props.match.params.channelName) {
            console.log('switching channels...');
            this.props.socket.emit('leave channel');
            const { channelName } = this.props.match.params;
            this.props.socket.emit('join channel', channelName);
        }
        // scroll message window to bottom
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;

    }
    componentWillUnmount() {
        // console.log('channel view component unmounting');
        this.props.socket.emit('leave channel');
        this.props.socket.off('new message');
        this.props.socket.off('user joined channel');
        this.props.socket.off('send initial response');
        this.props.socket.off('user left channel');
        this.props.populateChannelUsers([]);
    }
    renderMessages() {
        let { user } = this.props.user
        return this.state.messages.map((message, i) =>
            <div className={`user-message ${message.user_id === user ? 'my-msg' : 'their-msg'}`} key={i}>

                <Link to={`/dashboard/profile/${message.user_id}`}>
                    <img className="message-user-image" src={message.user_image} alt="temporary alt" />
                    <h6>{message.username}</h6>
                </Link>
                <span className="timestamp"> <DateStamp date={parseInt(message.time_stamp)}/></span>
                {message.content_image? <img src={message.content_image} className="message-image"  alt="temporary alt" />: false}
                <p>{message.content_text}</p>
            </div>
        );
    }
    updateInput(e) {
        const { name, value } = e.target;
        // check to see if message contains an image url then do something about it
        if (value.match(/\.(jpeg|jpg|gif|png)$/)) {
            console.log("message input is an image")
        }

        this.setState({ [name]: value });

    }
    sendMessage() {
        if (!this.props.user)
            return;
        if (this.state.messageInput.trim()) {
            let { messages } = this.state;
            const message = {
                contentText: this.state.messageInput,
                channelId: this.state.channelId
            }
            this.props.socket.emit('create message', message);
            const localMessage = {
                content_text: this.state.messageInput,
                content_image: null,
                time_stamp: Date.now(),
                username: this.props.user.user.username,
                user_image: null

            }
            messages.push(localMessage);
            this.setState({ messageInput: '', messages })
        }
    }
    render() {
        return (
            <div className="ChannelView">
                <div className="header">
                    <h2 style={{ color: 'white' }}>{this.state.channelName}</h2>
                    {/* if channel.id is not in subchannel array  */}
                    <button className="follow">+</button>
                    {/* if channel.id IS in subchannel array  */}
                    <button className="unfollow">-</button>

                    <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                </div>
                <div className="messages" ref={this.messageWindowRef}>
                    {this.renderMessages()}
                </div>
                <div className="input-holder">
                    <input
                        className="input-bar"
                        type="text"
                        placeholder="New Message"
                        name="messageInput"
                        value={this.state.messageInput}
                        onChange={e => this.updateInput(e)}
                        onKeyPress={e => { if (e.key === 'Enter') this.sendMessage() }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { isAuthenticated, user, channelUsers } = state;
    return {
        user,
        isAuthenticated,
        channelUsers
    }
}


export default connect(mapStateToProps, { populateChannelUsers })(ChannelView);
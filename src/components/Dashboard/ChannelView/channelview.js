import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InputBar from './InputBar';
import { populateChannelUsers } from '../../../redux/reducer';
import getDate from '../../DateFormat/dateStamp';
import './channelview.css';

class ChannelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typingUsers: [],
            messages: [],
            channelId: -1,
            typing: false,
            messageFilter: ''
        }
        this.messageWindowRef = React.createRef();
        this.lastMessageRef = React.createRef();
        this.sendMessage = this.sendMessage.bind(this);
        /*
            Socket Listeners
        */

        this.props.socket.on('send initial response', initialResponse => {
            let messageReactions = {}
            initialResponse.existingMessageReactions.forEach(reaction => {
                if (!messageReactions[reaction.channel_message_id])
                    messageReactions[reaction.channel_message_id] = {};
                if (!messageReactions[reaction.channel_message_id][reaction.reaction_name])
                messageReactions[reaction.channel_message_id][reaction.reaction_name] = [];
                messageReactions[reaction.channel_message_id][reaction.reaction_name].push(reaction.username);
            });
            initialResponse.existingMessages.forEach(message => {
                if (messageReactions[message.id])
                    message.reactions = messageReactions[message.id];
            });
            this.props.populateChannelUsers(initialResponse.users);
            this.setState({ messages: initialResponse.existingMessages, channelId: initialResponse.channelId, channelName: initialResponse.channelName }, this.forceScrollDown);
        });
        this.props.socket.on('new message', newMessage => {
            let { messages } = this.state;
            messages.push(newMessage);
            this.setState({ messages });
            // this.userNotTyping(newMessage.username)
        });
        this.props.socket.on('message was reacted to', (messageId, reactionName, username) => {
            const { messages } = this.state;
            // find the message
            const messageIndex = messages.findIndex(message => message.id === messageId)
            if (messageIndex === -1)
                return;
            // check if message has any reactions
            if (messages[messageIndex].reactions) {
                // check if it has reactions of the specified type
                if (messages[messageIndex].reactions[reactionName]) {
                    // check for the username in reactions of the specified type
                    const usernameIndex = messages[messageIndex].reactions[reactionName].indexOf(username);
                    // add the username to that array if it's not there
                    if (usernameIndex === -1) {
                        messages[messageIndex].reactions[reactionName].push(username);
                    } else {
                        // remove it if it is there
                        messages[messageIndex].reactions[reactionName] = messages[messageIndex].reactions[reactionName].filter(reactionUsername => reactionUsername !== username);
                        if (messages[messageIndex].reactions[reactionName].length === 0)
                            delete messages[messageIndex].reactions[reactionName];
                        // console.log(messages[messageIndex].reactions);
                        if (Object.keys(messages[messageIndex].reactions).length === 0 && messages[messageIndex].reactions.constructor === Object)
                            delete messages[messageIndex].reactions;
                    }
                } else {
                    // if no reactions of the specified type set them up
                    messages[messageIndex].reactions[reactionName] = [];
                    messages[messageIndex].reactions[reactionName].push(username);
                }

            } else {
                // if no reactions at all set them up
                messages[messageIndex].reactions = {};
                messages[messageIndex].reactions[reactionName] = [];
                messages[messageIndex].reactions[reactionName].push(username);
            }
            this.setState({messages});
        });
        this.props.socket.on('user joined channel', newUser => {
            let channelUsers = [...this.props.channelUsers];
            if (channelUsers.findIndex(existingUser => existingUser.id === newUser.id && existingUser.online === newUser.online) !== -1)
                return;
            if (newUser.subbed) {
                let userIndex = channelUsers.findIndex(existingUser => existingUser.id === newUser.id)
                if (userIndex !== -1)
                    channelUsers[channelUsers.findIndex(existingUser => existingUser.id === newUser.id)].online = true;
                else {
                    channelUsers.push(newUser)
                }
            }
            else
                channelUsers.push(newUser);
            channelUsers.sort((a, b) => a.username < b.username ? -1 : 1);
            this.props.populateChannelUsers(channelUsers);
        });
        this.props.socket.on('user left channel', username => {
            let channelUsers = [...this.props.channelUsers];
            const userIndex = channelUsers.findIndex(user => user.username === username);
            if (channelUsers[userIndex].subbed)
                channelUsers[userIndex].online = false;
            else
                channelUsers = channelUsers.filter(user => user.username !== username);
            this.props.populateChannelUsers(channelUsers);
        });
        this.props.socket.on('stopped typing', username => {
            console.log(username + ' stopped typing')
        });
        this.props.socket.on('is typing', username => {
            console.log(username + ' is typing')
            let typing = this.state.typingUsers
            if (typing.indexOf(username) === -1) {
                typing.push(username)
                this.setState({
                    typingUsers: typing
                })
                setTimeout(this.userNotTyping, 3000)
            }
        });
        this.props.socket.on('user subbed to channel', newSubUser => {
            const channelUsers = [...this.props.channelUsers];
            const userIndex = channelUsers.findIndex(user => user.id === newSubUser.id);
            if (userIndex === -1)
                channelUsers.push(newSubUser);
            else
                channelUsers[userIndex].subbed = true;
            this.props.populateChannelUsers(channelUsers);
        });
        this.props.socket.on('user unsubbed from channel', userId => {
            let channelUsers = [...this.props.channelUsers];
            const userIndex = channelUsers.findIndex(user => user.id === userId);
            if (userIndex !== -1) {
                if (channelUsers[userIndex].online)
                    channelUsers[userIndex].subbed = false;
                else
                    channelUsers = channelUsers.filter(user => user.id !== userId);
                this.props.populateChannelUsers(channelUsers);
            }
        });


        /*
            End Socket Listeners
        */
    }

    /*
        Lifecyle Methods
    */

    componentDidMount() {
        const { channelName } = this.props.match.params;
        this.props.socket.emit('join channel', channelName);
    }
    componentDidUpdate(prevProps, prevState) {

        if (prevProps.match.params.channelName !== this.props.match.params.channelName) {
            // console.log('switching channels...');
            this.props.socket.emit('leave channel');
            const { channelName } = this.props.match.params;
            this.props.socket.emit('join channel', channelName);
        }
        const { clientHeight, scrollHeight, scrollTop } = this.messageWindowRef.current;
        // console.log(clientHeight, scrollHeight - scrollTop - 101);
        if (this.lastMessageRef.current) {
            console.log(scrollHeight - scrollTop - this.lastMessageRef.current.clientHeight, clientHeight + 150)
            if (scrollHeight - scrollTop - this.lastMessageRef.current.clientHeight <= clientHeight + 150)
                this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
        }
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

    /*
        User Input
    */

    userNotTyping = (x) => {
        let typing = this.state.typingUsers
        typing.splice(typing.indexOf(x), 1)
        this.setState({
            typingUsers: typing
        })
        this.props.socket.emit('stopped typing');
        console.log('stopped typing')
    }
    isTyping = () => {
        this.setState({
            typing: true
        })
        this.props.socket.emit('is typing');
        setTimeout(this.notTyping, 3000)
    }

    notTyping = () => {
        this.setState({
            typing: false
        })
        this.props.socket.emit('stopped typing');
        // console.log('stopped typing')
    }

    /*
        Message Functionality
    */

    sendMessage(newMessage) {
        if (!this.props.user)
            return;
        if (newMessage.trim()) {
            const message = {
                contentText: newMessage,
                channelId: this.state.channelId
            }
            this.props.socket.emit('create message', message);
        }
    }
    likeMessage(messageId) {
        if (!this.props.user)
            return;
        this.props.socket.emit('react to message', messageId, this.state.channelId, 'like');
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }


    /*
        Render Methods
    */
    forceScrollDown() {
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
    }
    renderMessages() {
        if (!this.state.messages[0])
            return <div className="user-message">No messages in this channel yet. Start chatting!</div>
        let { messages }= this.state;
        if (this.state.messageFilter.trim())
            messages = messages.filter(message => message.content_text.includes(this.state.messageFilter.trim()))
        return messages.map((message, i) => {
            let messageRef = '';
            if (i === messages.length - 1)
                messageRef = this.lastMessageRef;
            return (
                <div className="user-message" key={i} ref={messageRef}>
                    <div className="message-data">
                        <Link to={`/dashboard/profile/${message.user_id}`}>{message.username}</Link>
                        <div className="time-stamp">{getDate(message.time_stamp)}</div>
                    </div>
                    <div className="message-content">{message.content_text}</div>
                    <div className="message-reactions">
                        <span>
                            <i className="fas fa-thumbs-up" onClick={() => this.likeMessage(message.id)}></i> {message.reactions ? message.reactions.like.length : null}
                        </span>
                    </div>
                </div>
            )
        });
    }
    render() {
        return (
            <div className="ChannelView">
                <div className="header">
                    <h2>#{this.state.channelName}</h2>
                    <input 
                        type="text" 
                        name="messageFilter" 
                        className="message-filter"
                        placeholder="Filter Messages"
                        value={this.state.messageFilter}
                        onChange={e => this.updateInput(e)}
                    />
                </div>
                <div className="messages" ref={this.messageWindowRef}>
                    {this.renderMessages()}
                </div>
                    {/* {displayTypingUsers} */}
                <div className="input-holder">
                    <InputBar socket={this.props.socket} sendMessage={this.sendMessage} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { isAuthenticated, user, channelUsers } = state;
    return {
        user,
        isAuthenticated,
        channelUsers
    }
}


export default connect(mapStateToProps, { populateChannelUsers })(ChannelView);
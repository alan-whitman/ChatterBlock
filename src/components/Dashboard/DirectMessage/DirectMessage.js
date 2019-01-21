import React, { Component } from 'react';
import { connect } from 'react-redux';
import { populateActiveDms } from '../../../redux/reducer';
import './DirectMessage.css';
import InputBar from '../ChannelView/InputBar';
import axios from 'axios';
import DirectMessageMessage from './DirectMessageMessage';

class DirectMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            messageInput: '',
            dmPartner: {},
            messageFilter: ''
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.directMessageWindowRef = React.createRef();
        this.props.socket.on('send initial dm response', initialResponse => {
            this.setState({ messages: initialResponse.existingMessages, dmPartner: initialResponse.dmPartner });
        });
        this.props.socket.on('new direct message', newMessage => {
            if (newMessage.sender !== this.props.match.params.username && newMessage.sender !== this.props.user.user.username)
                return;
            let messages = [...this.state.messages];
            messages.push(newMessage);
            this.setState({ messages });
        });
    }
    componentDidMount() {
        this.props.socket.emit('join direct message', this.props.match.params.username);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.username !== this.props.match.params.username) {
            this.props.socket.emit('join direct message', this.props.match.params.username);
        }
        this.directMessageWindowRef.current.scrollTop = this.directMessageWindowRef.current.scrollHeight;
    }
    sendMessage(newMessage) {
        if (newMessage.trim() === '')
            return;
        if (!this.state.dmPartner.id)
            return;
        this.props.socket.emit('send direct message', newMessage, this.state.dmPartner.id);
        let activeDms = [...this.props.activeDms];
        if (activeDms.findIndex(user => user.username === this.state.dmPartner.username) === -1) {
            activeDms.push(this.state.dmPartner);
            activeDms.sort();
            this.props.populateActiveDms(activeDms);
        }
        this.setState({ messageInput: '' });
    }
    hideConversation() {
        let activeDms = [...this.props.activeDms];
        activeDms = activeDms.filter(username => username !== this.props.match.params.username);
        this.props.populateActiveDms(activeDms);
        axios.delete('/api/dm/hideDm/' + this.state.dmPartner.id);
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    renderMessages() {
        if (!this.props.isAuthenticated)
            return <div className="user-message">You must be logged in to send and receive direct messages</div>
        if (this.props.match.params.username === this.props.user.user.username)
            return <div className="user-message">Try sending a message to someone that's not you!</div>
        if (!this.state.messages[0])
            return <div className="user-message">You have no message history with {this.props.match.params.username}. Say hello!</div>
        let messages = [...this.state.messages];
        if (this.state.messageFilter.trim())
            messages = messages.filter(message => message.content_text.includes(this.state.messageFilter.trim()))
        return messages.map((message, i) => {
            return (
                <DirectMessageMessage
                    message={message}
                    key={i}
                />
            )
        });
    }
    render() {
        const friendIndex = this.props.friends.findIndex(friend => friend.username === this.props.match.params.username);
        let indicatorColor;
        if (friendIndex !== -1)
            indicatorColor = this.props.friends[friendIndex].online ? 'green' : 'red';
        if (this.state.loading)
            return <div className="DirectMessage"></div>;
        return (
            <div className="DirectMessage">
                <div className="header">
                    <h2>@{this.props.match.params.username}</h2>
                    {friendIndex !== -1 ?
                        <div className="online-indicator" style={{ backgroundColor: indicatorColor }} />
                        : null}
                    <div>
                        {this.props.activeDms.indexOf(this.props.match.params.username) !== -1 ?
                            <button className="hide-conversation" onClick={e => this.hideConversation()}>Hide Conversation</button>
                        : null}
                    </div>
                    <input
                        type="text"
                        name="messageFilter"
                        className="message-filter"
                        placeholder="Filter Messages"
                        value={this.state.messageFilter}
                        onChange={e => this.updateInput(e)}
                    />
                </div>
                <div className="messages" ref={this.directMessageWindowRef}>
                    {this.renderMessages()}
                </div>
                <div className="input-holder">
                    <InputBar socket={this.props.socket} sendMessage={this.sendMessage} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { user, isAuthenticated, activeDms, friends } = state;
    return {
        user,
        isAuthenticated,
        activeDms,
        friends
    }
}

export default connect(mapStateToProps, { populateActiveDms })(DirectMessage);
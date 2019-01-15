import React, { Component } from 'react';
import { connect } from 'react-redux';
import DateStamp from '../../DateFormat/dateStamp'
import './channelview.css';
import axios from 'axios';

class ChannelView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            channelId: -1,
            messageInput: '',
            prevProps:false,
            subIds:[]
        }
        this.messageWindowRef = React.createRef();
        this.props.socket.on('send initial response', initialResponse => {
            this.setState({ messages: initialResponse.existingMessages, channelId: initialResponse.channelId });
        });
        this.props.socket.on('new message', newMessage => {
            let { messages } = this.state
            messages.push(newMessage);
            this.setState({ messages });
        })
    }
    componentWillMount() {
        const { channelName } = this.props.match.params;
        this.props.socket.emit('join channel', channelName);
        this.getMessages();
        this.setState({prevProps: this.props.match.params.channelName});
    }
    componentDidUpdate() {

        if(this.state.prevProps !== this.props.match.params.channelName){
            this.setState({prevProps: this.props.match.params.channelName})
            // console.log(this.state.prevProps)
            this.getMessages();
        }
        // scroll message window to bottom
        this.messageWindowRef.current.scrollTop = this.messageWindowRef.current.scrollHeight;
        // console.log("channel updated")
        // this.renderMessages()

        
    }





    getMessages = () => {
        console.log(this.props.match.params.channelName)

//    this.props.user.userSubChannels.forEach(function (chan) {
//     // var subIds = [];
//     // subIds.push(chan.id);
// }); 
console.log(this.props.user.userSubChannels)

        axios.get(`/api/channel/messages/${this.props.match.params.channelName}`).then(response => {
            this.setState({messages: response.data}) 

            console.log(this.state.messages)
        })
    }
    renderMessages() {
        let {user} = this.props.user
        return this.state.messages.map((message, i) =>
            <div className={`user-message ${message.user_id == user ? 'my-msg' : 'their-msg'}`} key={i}>

                <img className="message-user-image" src={message.user_image}/><h6>{message.username}{message.user_id} <span className="timestamp"> <DateStamp date={parseInt(message.time_stamp)}/></span></h6>
                {message.content_image? <img src={message.content_image} src="message-image"/>: false}
                <p>{message.content_text}</p>
            </div>
        );
    }
    updateInput(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });

    }
    sendMessage() {
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
                    <div className="header-main">
                        <h2 style={{ color: 'white' }}>{this.props.match.params.channelName}</h2>
                        {/* {console.log(this.props.user.userSubChannels.indexOf(`id: ${this.state.channelId}`),this.state.channelId)} */}
                        {/* {this.props.user.userSubChannels.indexOf(this.state.channelId) > -1 ? <button></button> : <button></button>} */}
                        <div><input className="searchInput" type="text" placeholder="Search Users" /> <span><i className="fas fa-search"></i></span></div>
                    </div>
                </div>
                <div className="textarea container" ref={this.messageWindowRef}>
                    {this.renderMessages()}
                </div>
                <div className="message-input">
                    {/* {this.props.isAuthenticated ? */}
                    <input
                        className="main-message"
                        type="text"
                        placeholder="New Message"
                        name="messageInput"
                        value={this.state.messageInput}
                        onChange={e => this.updateInput(e)}
                        onKeyPress={e => { if (e.key === 'Enter') this.sendMessage() }}
                    />
                    {/* : null} */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let { isAuthenticated, user } = state;
    return {
        user,
        isAuthenticated
    }
}


export default connect(mapStateToProps)(ChannelView);
import React from 'react';
import { Link } from 'react-router-dom';
import getDate from '../../DateFormat/dateStamp';

class Message extends React.PureComponent {
    render() {
        return (
            <div className="user-message" ref={this.props.messageRef}>
                <div className="message-data">
                    <Link to={`/dashboard/profile/${this.props.message.user_id}`}>{this.props.message.username}</Link>
                    <div className="time-stamp">{getDate(this.props.message.time_stamp)}</div>
                </div>
                <div className="message-content">{this.props.message.content_text}</div>
                <div className="message-reactions">
                    <span>
                        <i className="fas fa-thumbs-up" onClick={() => this.props.likeMessage(this.props.message.id)}></i> {this.props.likes > 0 ? this.props.likes : null}
                    </span>
                </div>
            </div>
        )
    }
}

export default Message;
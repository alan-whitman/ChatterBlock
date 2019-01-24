import React, { Component } from 'react';
import './UserAlert.css';
import Transition from 'react-addons-css-transition-group';
import { createAlertMessage } from '../../redux/reducer';
import { connect } from 'react-redux';

class UserAlert extends Component {
    state = {
        timeoutTracker: {},
        alertMessages: []
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.alertMessage.alertCount !== this.props.alertMessage.alertCount) {
            let alertMessages = [...this.state.alertMessages];
            alertMessages.push(this.props.alertMessage);
            let timeoutTracker = {...this.state.timeoutTracker}
            const timeoutId = this.props.alertMessage.message + this.props.alertMessage.alertCount;
            const alertTimeout = setTimeout(() => this.clearAlertMessage(timeoutId), 4000);
            timeoutTracker[timeoutId] = alertTimeout;
            this.setState({alertMessages, timeoutTracker});
        }
    }
    clearAlertMessage(timeoutId) {
        let alertMessages = [...this.state.alertMessages];
        alertMessages = alertMessages.filter(message => {
            const messageAndCount = message.message + message.alertCount
            return  messageAndCount !== timeoutId;
        });
        this.setState({alertMessages})
    }
    cancelTimeout(timeoutId) {
        let timeoutTracker = {...this.state.timeoutTracker};
        clearTimeout(timeoutTracker[timeoutId]);
        delete timeoutTracker[timeoutId];
        this.setState({timeoutTracker})
    }
    renderAlertMessages() {
        return this.state.alertMessages.map((alertMessage, i) => {
            return (
               <div className="alert" key={alertMessage.message + alertMessage.alertCount}>
                    <i className="close-message fa fa-window-close" aria-hidden="true" onClick={e => this.clearAlertMessage(alertMessage.message + alertMessage.alertCount)}></i>
                    <i className="pin-message fas fa-thumbtack" onClick={e => this.cancelTimeout(alertMessage.message + alertMessage.alertCount)}></i>
                    <div className="alert-text">{alertMessage.message}</div>
                    <div 
                        style={{
                            animationName: 'alert-timer-animation', 
                            animationDuration: this.state.timeoutTracker[alertMessage.message + alertMessage.alertCount] ? '3.9s' : '0s'
                        }} 
                        className="alert-timer">
                    </div>
                </div>
            )
        
        })
    }
    render() {
        return (
            <div className="UserAlert">
                <Transition
                    transitionName="ua"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    {this.renderAlertMessages()}
                </Transition>
            
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { alertMessage } = state;
    return {
        alertMessage
    }
}

export default connect(mapStateToProps, { createAlertMessage })(UserAlert);
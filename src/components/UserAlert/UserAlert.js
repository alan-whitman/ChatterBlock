import React, { Component } from 'react';
import './UserAlert.css';
import Transition from 'react-addons-css-transition-group';
import { createAlertMessage } from '../../redux/reducer';
import { connect } from 'react-redux';

class UserAlert extends Component {
    state = {
        // timeoutTracker: {},
        alertMessages: []
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.alertMessage.alertCount !== this.props.alertMessage.alertCount) {
            let alertMessages = [...this.state.alertMessages];
            alertMessages.push(this.props.alertMessage);
            // let timeoutTracker = {...this.state.timeoutTracker}
            // const timeoutId = this.props.alertMessage.message + this.props.alertMessage.alertCount;
            // const alertTimeout = setTimeout(() => this.clearAlertMessage(), 4000);
            setTimeout(() => this.clearAlertMessage(), 4000);
            // timeoutTracker[timeoutId] = alertTimeout;
            this.setState({alertMessages});
        }
    }
    clearAlertMessage() {
        let alertMessages = [...this.state.alertMessages];
        alertMessages = alertMessages.slice(1);
        this.setState({alertMessages})
    }
    renderAlertMessages() {
        return this.state.alertMessages.map((alertMessage, i) => <div className="alert" key={alertMessage.message + alertMessage.alertCount}>{alertMessage.message}</div>)
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
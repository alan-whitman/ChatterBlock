import React, { Component } from 'react';
import { connect } from 'react-redux';
import './recent.css';
import { createAlertMessage } from '../../../redux/reducer';

class Recent extends Component {
    // constructor() {
    //     super();
    //     this.divRef = React.createRef();
    // }
    // state = {
    //     showDiv: 'none'
    // }
    // show() {
    //     this.setState({showDiv: 'block'}, () => this.divRef.current.focus());
        
    // }
    // hide() {
    //     this.setState({showDiv: 'none'});
    // }
    render(){
        return (
            <div className="Recent">
                <h1 style={{color: 'white'}}>Recent stuff</h1>
                <button onClick={() => this.props.createAlertMessage('test')}>click</button>

            </div>
        )
    }
}

export default connect(null, { createAlertMessage })(Recent);
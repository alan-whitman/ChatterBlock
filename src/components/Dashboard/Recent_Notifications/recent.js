import React, { Component } from 'react';
import { connect } from 'react-redux';
import './recent.css';
import { createAlertMessage } from '../../../redux/reducer';

class Recent extends Component {
    constructor() {
        super();
        this.divRef = React.createRef();
    }
    state = {
        showDiv: 'none'
    }
    show() {
        this.setState({showDiv: 'block'}, () => this.divRef.current.focus());
        
    }
    hide() {
        this.setState({showDiv: 'none'});
    }
    render(){
        console.log(this.state.showDiv);
        return (
            <div className="Recent">
                <h1 style={{color: 'white'}}>Recent stuff</h1>
                <button onClick={e => this.show()}>click</button>
                <div tabIndex="1" style={{width: 50, height: 50, background: 'red', display: this.state.showDiv, outline: 'none'}} onBlur={e => this.hide()} ref={this.divRef}></div>
            </div>
        )
    }
}

export default connect(null, { createAlertMessage })(Recent);
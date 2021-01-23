import React, { Component } from 'react'
import { Consumer } from './context.js';

export default class Redirect extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Consumer>
                {
                    state => {
                        state.history.push(this.props.to);
                        return null;
                    }
                }
            </Consumer>
        )
    }
}

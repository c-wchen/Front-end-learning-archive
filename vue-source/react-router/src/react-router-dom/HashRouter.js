import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from './context.js'
export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            location: {
                pathname: window.location.hash.slice(1) || '/',
            }
        };
    }
    componentDidMount() {
        // 默认hash
        window.location.hash = window.location.hash || '/';
        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.state.location =
            this.setState({
                location: {
                    pathname: window.location.hash.slice(1) || '/'
                }
            });
        })

    }
    render() {
        let value = {
            location: this.state.location,
            history: {
                push(to) {
                    window.location.hash = to;
                }
            }
        };
        return (
           <Provider value={value}>
                {this.props.children}
           </Provider>
        )
    }
}
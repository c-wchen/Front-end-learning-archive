import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Consumer } from './context.js'
let pathToRegexp = require("path-to-regexp")
export default class Profile extends Component {
    constructor() {
        super();
    }
   
    render() {
        return (
            <Consumer>
                {
                    state => {
                        {/*  path是route传递的 */}
                        let {path, component: Component} = this.props;
                        let pathname = state.location.pathname;
                
                        {/* 根据path实现正则，通过匹配 */}
                        let reg = pathToRegexp.pathToRegexp(path, [], {end: true});
                        if(pathname.match(reg)) {
                            return <Component></Component>
                        } 
                        return null;
                    }
                }
            </Consumer>
        )
    }
}
import React, { Component } from 'react';
import { Consumer } from './context';
let pathToRegexp = require("path-to-regexp");
// switch的作用匹配到一个组件
export default class Switch extends Component {
    render() {
        return (
            <Consumer>
               {
                    state => {
                        let pathname = state.location.pathname;
                        let children = this.props.children;
                        for(let i = 0; i < children.length; i++) {
                            let child = children[i];
                            {/* redirect可能没有path属性 */}
                            let path = child.props.path || '';
                            let reg = pathToRegexp.pathToRegexp(path, [], {end: true});
                            if(reg.test(pathname)) {
                                {/* 把匹配组件返回即可 */}
                                return child;
                            }
                        }
                        return null;
                    }
               }
            </Consumer>
        )
    }
}

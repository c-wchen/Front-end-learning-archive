import { createElement, render, renderDOM } from './vnode.js';
import diff from './diff.js';
import patch from './patch.js';

let virtualDOM = createElement('ul', {class: 'list', style: 'background: orange; margin: 0;'},[
    createElement('li', {class: 'item'}, [
        createElement('div', {class: 'item'}, ['div1']),
        createElement('div', {class: 'item'}, ['div2']),
        createElement('div', {class: 'item'}, ['div2'])
    ]),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['c'])
]);
let virtualDOM2 = createElement('ul', {class: 'list-group', style: 'background: orange; margin: 0;'},[
    createElement('li', {class: 'item'}, [
        createElement('span', {class: 'item'}, ['2']),
        createElement('div', {class: 'item'}, ['3'])
    ]),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['c'])
]);
// 渲染节点
let el = render(virtualDOM);
// 渲染到DOM
renderDOM(el, document.body);

// 打补丁重新更新视图
let patches = diff(virtualDOM, virtualDOM2);
patch(el, patches);
console.log(el);
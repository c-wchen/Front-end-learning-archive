// 虚拟节点
class VNode {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}
// 创建虚拟节点
function createElement(type, props, children) {
    return new VNode(type, props, children)
}
// 设置属性
function setAttr(node, key, value) {
    switch(key) {
        case 'value': 
            if(node.tagName.toUpperCase == 'INPUT' || node.tagName.toUpperCase () == 'TEXTAREA') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        case 'style': 
            node.style.cssText = value;
            break;
        default: 
            node.setAttribute(key, value);
            break;
    }
}
// 渲染节点
function render(node) {
    let el = document.createElement(node.type);
    for(let key in node.props) {
        // 设置属性的方法
        setAttr(el, key, node.props[key]);
    }
    node.children.forEach(child => {
        // 进行递归调用
        child = (child instanceof VNode) ? render(child) : document.createTextNode(child);
        el.appendChild(child); 
    });
    return el;
}
// 节点渲染到DOM
function renderDOM(el, target) {
    target.appendChild(el);
}

export { VNode, createElement, render, renderDOM } 
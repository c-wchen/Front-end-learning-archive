const ATTRS = 'ATTRS';
const TEXT = 'TEXT';
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
let Index = 1;

function diff(oldTree, newTree) {
    let patches = {};
    /**
     * 规则1： 节点类型相同，判断属性是否相同，产生属性的补丁包 
     * {type: 'ATTRS', attrs: {class: 'list-group'}
     * 规则2： 新的dom节点不存在 
     * {type: 'REMOVE', index: index}
     * 规则3： 节点类型不相同，直接替换
     * {type: 'REPLACE', newNode: newNode}
     * 规则4： 文本变换
     * {type: 'TEXT', text: 1}
     * 平级元素有互换，新增，会导致重新渲染
     */
    let index = 0;
    //递归树比较后的结果放在补丁包中
    walk(oldTree, newTree, index, patches);
    return patches;
}
function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    for(let key in oldAttrs) {
        if(oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key];
        }
    }
    for(let key in newAttrs) {
        // 老节点没有新节点的属性
        if(!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttr[key];
        }
    }
    return patch;
}
function diffChild(oldChildren, newChildren, index, patches) {
    oldChildren.forEach((child, currentIndex) => {
        walk(child, newChildren[currentIndex], ++Index, patches)
    });
}
function isText(node) {
    return typeof node == 'string' || typeof node == 'number';
}
function walk(oldNode, newNode, index, patches) {
    let currentPatch = [];
    if(!newNode){
        currentPatch.push({type: REMOVE, index})
    } else if(isText(oldNode) && isText(newNode)) {
        if(oldNode !== newNode) {
            currentPatch.push({type: TEXT, text: newNode});
        }
    } else if(oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attrs = diffAttr(oldNode.props, newNode.props);
        if(Object.keys(attrs).length > 0) {
            currentPatch.push({type: ATTRS, attrs});
        }
        diffChild(oldNode.children, newNode.children, index, patches);
    } else {
        currentPatch.push({type: REPLACE, newNode})
    }
    if(Object.keys(currentPatch).length > 0) {
        patches[index] = currentPatch;
    }
}

export default diff;

const compileUtil = {
	getVal(expr, vm) {
		// person.name.firstname => person[name][firstname];
		return expr.split('.').reduce((data, currentVal) => {
			return data[currentVal];
		}, vm.$data);
	},
	getContentVal(expr, vm) {
		return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
			return this.getVal(args[1], vm);
		})
	},
	setVal(expr, vm, inputVal) {
		return expr.split('.').reduce((data, currentVal) => {
			data[currentVal] = inputVal;
		}, vm.$data);
	},
	text(node, expr, vm) {
		let value;
		if (expr.indexOf('{{') !== -1) {
			//{{person.name}}
			value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
				new Watcher(vm, args[1], () => {
					this.updater.textUpdater(node, this.getContentVal(expr, vm));
				});
				return this.getVal(args[1], vm);
			})

		} else {
			value = this.getVal(expr, vm);
		}
		this.updater.textUpdater(node, value);
	},
	html(node, expr, vm) {
		const value = this.getVal(expr, vm);
		// 绑定观察者,将来数据发生变化去触发回调,进行更新
		new Watcher(vm, expr, (newVal) => {
			this.updater.htmlUpdater(node, newVal);
		})
		this.updater.htmlUpdater(node, value)
	},
	model(node, expr, vm) {
		// 数据驱动视图  数据 => 视图
		const value = this.getVal(expr, vm);
		// 绑定更新函数
		new Watcher(vm, expr, (newVal) => {
			this.updater.modelUpdater(node, newVal);
		})
		// 视图驱动数据  视图 => 数据
		node.addEventListener('input', e => {
			this.setVal(expr, vm, e.target.value);
		})

		this.updater.modelUpdater(node, value);
	},
	on(node, expr, vm, eventName) {
		let fn = vm.$options.methods && vm.$options.methods[expr];
		node.addEventListener(eventName, fn.bind(this), false);
	},
	updater: {
		textUpdater(node, value) {
			node.textContent = value;
		},
		htmlUpdater(node, value) {
			node.innerHTML = value;
		},
		modelUpdater(node, value) {
			node.value = value;
		}
	}
}
class Compile {
	constructor(el, vm) {
		this.el = this.isElementNode(el) ? el : document.querySelector(el);
		this.vm = vm;
		// 获取文档碎片对象，放入内存中减少页面的回流和重绘
		const fragment = this.node2Fragment(this.el);
		// 编译模板
		this.compile(fragment);
		// 追加子元素到根元素
		this.el.appendChild(fragment);
	}
	isElementNode(node) {
		return node.nodeType === 1
	}
	node2Fragment(el) {
		// 创建文档碎片
		const f = document.createDocumentFragment();
		let firstChild;
		while (firstChild = el.firstChild) {
			f.appendChild(firstChild);
		}
		return f;
	}
	compile(fragment) {
		const childNodes = fragment.childNodes;
		[...childNodes].forEach(child => {
			if (this.isElementNode(child)) {
				// 是元素节点
				// 编译元素节点
				this.compileElement(child);
			} else {
				this.compileText(child);
			}
			if (child.childNodes && child.childNodes.length) {
				this.compile(child);
			}
		})
	}
	compileElement(node) {
		const attributes = node.attributes;
		[...attributes].forEach(attr => {
			const {
				name,
				value
			} = attr;
			if (this.isDirective(name)) {
				const [, directive] = name.split('-');
				const [dirName, eventName] = directive.split(':');
				// 数据驱动视图
				compileUtil[dirName](node, value, this.vm, eventName);
				// 删除指令上的属性
				node.removeAttribute('v-' + directive);
			}
		})
	}
	compileText(node) {
		const content = node.textContent;
		if (/\{\{.+?\}\}/.test(content)) {
			compileUtil['text'](node, content, this.vm);
		}
	}
	// 判断是vue指令
	isDirective(attrName) {
		return attrName.startsWith('v-');
	}
}

class CVue {
	constructor(options) {
		this.$el = options.el;
		this.$data = options.data;
		this.$options = options;
		if (this.$el) {
			// 实现一数据观测者
			new Observer(this.$data);
			// 实现指令解析器
			new Compile(this.$el, this);
			this.proxyData(this.$data);
		}
	}
	proxyData(data) {
		for(const key in data) {
			Object.defineProperty(this, key, {
				get() {
					return data[key];
				},
				set(newVal) {
					data[key] = newVal;
				}
			})
		}
	}
}

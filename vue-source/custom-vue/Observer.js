class Watcher {
	constructor(vm,expr,cb) {
		this.vm = vm;
		this.expr = expr;
		this.cb = cb;
		this.oldVal = this.getOldVal();
	}
	getOldVal() {
		Dep.target = this;
		// 获取数据的时候会通过Observer get方法
		const oldVal = compileUtil.getVal(this.expr,this.vm);
		Dep.target = null;
		return oldVal;
	}
	update() {
		const newVal = compileUtil.getVal(this.expr,this.vm);
		if(newVal !== this.oldVal) {
			this.cb(newVal);
		}
	}
}
// 收集依赖器
class Dep {
	constructor(){
		this.subs = [];
	}
	// 收集观察者
	addSub(watcher) {
		this.subs.push(watcher);
	}
	// 通知观察者去更新
	notify() {
		
		this.subs.forEach(w => w.update());
	}
}

/**
 * 劫持数据重新配置对象
 */
class Observer {
	constructor(data) {
		this.observe(data);
	}
	observe(data) {
		// 判断data是否存在并且类型为对象类型
		if(data && typeof data === 'object') {
			Object.keys(data).forEach(key => {
				this.defineReactive(data,key,data[key]);
			});
		}
		
	}
	// value作为defineReative内的全局变量
	defineReactive(obj,key,value) {
		//递归遍历
		this.observe(value);
		const dep = new Dep();
		// 劫持并监听所有的属性
		Object.defineProperty(obj,key,{
			emumerable: true,
			configurable: false,
			// 获取数据的时候触发
			get: () => {
				// 创建订阅者获取数据时，会加入收集依赖器
				Dep.target && dep.addSub(Dep.target);
				return value;
			},
			// 外界进行修改的时候
			set: (newVal) => {
				this.observe(newVal)
				if(newVal !== value) {
					value = newVal;
				}
				// 告诉Dep通知变化
				dep.notify();
			}
		});
	}
}


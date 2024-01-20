import React, { forwardRef } from "react";

class ComponentGrand extends React.Component {
  setDivRef = (ref) => {
    this.divRef = ref;
  }
  div2Ref = React.createRef();
  componentDidMount(): void {
    // console.log('-----ComponentGrand', this.divRef);
    console.log('-----ComponentGrand', this.div2Ref);

  }
  render() {
    return (
      <div>
        <ComponentFather>
          {/* <div ref={this.setDivRef}>1111</div> */}
          {/* <div ref={this.div2Ref}></div> */}
          <ComponentSonClass ref={this.div2Ref}></ComponentSonClass>

          {/* <ComponentSonFunc ref={this.div2Ref}>2222</ComponentSonFunc> */}
        </ComponentFather>
      </div>
    );
  }
}

class ComponentSonClass extends React.Component {
  render() {
    console.log('==========ComponentSonClass', this)
    return <div>444</div>;
  }
}

const ComponentSonFunc = forwardRef((props, ref) => {
  console.log('==========ComponentSonFunc', ref)
  return <div ref={ref}>{props.children}</div>
})

class ComponentFather extends React.Component {
  component2Ref = React.createRef();
  componentDidMount(): void {
    console.log('==========ComponentFather', this.component2Ref)
  }
  onMouseEnter = () => {
    console.log('==========onMouseEnter')
  }
  render() {
    // 当children的ref为回调函数时，使用React.cloneElement时，会将ref回调函数的参数作为第三个参数传入
    const newChildren = React.cloneElement(this.props.children, {
      ref: (ref) => {
        /**
         * ref的值：
         * 1. 当children为原生dom时，ref的值为原生dom节点
         * 2. 当children为类组件时，ref的值为类组件的实例
         * 3. 当children为函数组件时
         *    如果函数组件未使用forwardRef，则不会执行到当前代码
         *    如果函数组件使用了forwardRef，且函数组件内部使用了ref参数挂载到原生dom节点，则ref的值为原生dom节点；
         */
        this.component2Ref.current = ref;
        // 原生dom节点的ref属性为回调函数时，回调函数参数ref的值为原生dom节点
        // 判断children是否为原生dom节点
        if (typeof this.props.children.type === 'string') {
          // 判断原生dom节点的ref属性是否为回调函数
          if (typeof this.props.children.ref === 'function') {
            // 将原生dom节点作为回调函数的参数
            this.props.children.ref(ref);
          }
          // 判断原生dom节点的ref属性是否为对象
          if (this.props.children.ref && typeof this.props.children.ref === 'object') {
            // 将原生dom节点作为对象的current属性
            this.props.children.ref.current = ref;
          }
        }
      },
      // 为children添加新的属性
      // 若children为原生dom节点，则会将新的属性添加到原生dom节点上
      // 若children为类组件，则会将新的属性添加到类组件的实例上，类组件的实例需新增对应的props，并绑定到类组件的实例dom节点上，否则绑定不起效果
      // 若children为函数组件，则会将新的属性添加到函数组件的实例上，函数组件的实例需新增对应的props，并绑定到函数组件的实例dom节点上，否则绑定不起效果
      onMouseEnter: this.onMouseEnter, 
      className: "newClassName"
    });
    return newChildren;
  }
}

export { ComponentGrand as ReactCloneElement };
import React, { forwardRef } from 'react';
class ClassComponentParent extends React.Component {
  ref = React.createRef();

  render () {
    return <div>
    <div>子组件：函数组件；父组件：类组件</div>
    <div>子组件为函数组件时，父组件ref转发给子组件需要用forwardRef包裹子组件</div>

    <FunctionComponentChildren ref={this.ref}/>
    <button onClick={() => this.ref.current.focus()}>focus</button>
  </div>;
  }
}

const FunctionComponentChildren = forwardRef((__, ref) => {
  return <input type="text" ref={ref}/>
})

export { ClassComponentParent as FuncChildClassParent}
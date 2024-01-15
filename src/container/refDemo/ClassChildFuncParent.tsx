import React, { useRef } from 'react';

const FunctionComponentParent = () => {
  // const childRef = React.createRef();
  const childRef = useRef(null)
  return <div>
    <div>子组件：类组件；父组件：函数组件</div>
    <ClassComponentChildren ref={childRef}/>
    <button onClick={() => {childRef.current.focus()}}>focus</button>
  </div>;
}

class ClassComponentChildren extends React.Component {
  ref = React.createRef();
  // 通过ref暴露给父组件的方法
  focus = () => {
    // do something
    this.ref.current.focus();
  }
  render() {
    return <input type="text" ref={this.ref}/>;
  }
}

export { FunctionComponentParent as ClassChildFuncParent }
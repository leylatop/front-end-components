import React from 'react';
class ClassComponentParent extends React.Component {
  childRef = React.createRef();
  
  render () {
    return <div>
    <div>子组件：类组件；父组件：类组件</div>
    <div>子组件为类组件时，父组件ref转发给子组件，父组件可以直接调用子组件的实例方法</div>
    <ClassComponentChildren ref={this.childRef}/>
    <button onClick={() => {
      this.childRef.current.focus();
    }}>focus</button>
  </div>;
  }
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


export { ClassComponentParent as ClassChildClassParent }
import React from "react";
import { useRef } from "react";

export const Parent = () => {
  // const childRef = useRef(null)
  const childRef = { current: null}
  const setRef = (ref) => {
    childRef.current = ref.current
  }
  const handleClick = () => {
    childRef.current.focus()
  }
  return (
    <div>
      <Child setRef={setRef} />
      <button onClick={handleClick}>focus</button>
    </div>
  )
}

class Child extends React.Component {
  ref = React.createRef();
  componentDidMount(): void {
    this.props.setRef(this.ref);
  }
  // 通过ref暴露给父组件的方法
  focus = () => {
    // do something
    this.ref.current.focus();
  }
  render() {
    return <input type="text" ref={this.ref}/>;
  }
}

export { Parent as ClassChildRefCallbackParent }


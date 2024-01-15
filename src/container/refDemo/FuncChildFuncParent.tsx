import React, { forwardRef } from 'react';

const FunctionComponentParent = () => {
  // const ref = useRef(null);
  const ref = React.createRef();
  return <div>
    <div>子组件：函数组件；父组件：函数组件</div>
    <div>子组件为函数组件时，父组件ref转发给子组件需要用forwardRef包裹子组件</div>
    <FunctionComponentChildren ref={ref}/>
    <button onClick={() => {ref.current.focus();}}>focus</button>
  </div>;
}

const FunctionComponentChildren = forwardRef((__, ref) => {
  return <input type="text" ref={ref}/>
})

export { FunctionComponentParent as FuncChildFuncParent}
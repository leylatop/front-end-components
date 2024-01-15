import { useEffect, useRef } from "react";

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

export const Child = (props) => {
  const inputRef = useRef(null)
  useEffect(() => {
    props.setRef(inputRef)
  }, [])
  return <input ref={inputRef} />
}

export { Parent as FuncChildRefCallbackParent }


import { FuncChildClassParent } from './FuncChildClassParent'
import { FuncChildFuncParent } from './FuncChildFuncParent'
import { ClassChildClassParent } from './ClassChildClassParent'
import { ClassChildFuncParent } from './ClassChildFuncParent'
import { FuncChildRefCallbackParent } from './FuncChildRefCallbackParent'
import { ClassChildRefCallbackParent } from './ClassChildRefCallbackParent'
import { Link } from 'react-router-dom'


export const RefDemo = () => {
  return (
    <div>
      <h1>Ref Demo</h1>
      <Link to="/func-child-class-parent">Func Child Class Parent</Link>
      <br />
      <Link to="/func-child-func-parent">Func Child Func Parent</Link>
      <br />
      <Link to="/class-child-class-parent">Class Child Class Parent</Link>
      <br />
      <Link to="/class-child-func-parent">Class Child Func Parent</Link>
      <br />
      <Link to="/func-child-ref-callback-parent">Func Child Ref Callback Parent</Link>
      <br />
      <Link to="/class-child-ref-callback-parent">Class Child Ref Callback Parent</Link>
    </div>
  )
}

export {
  FuncChildClassParent,
  FuncChildFuncParent,
  ClassChildClassParent,
  ClassChildFuncParent,
  FuncChildRefCallbackParent,
  ClassChildRefCallbackParent,
}
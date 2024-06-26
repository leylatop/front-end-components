import { TodoListContainer } from './container/TodoListContainer'
import { ToastContainer } from './container/ToastContainer'
import { TooltipContainer } from './container/TooltipContainer'
import { ListContainer } from './container/List'
import { FuncChildClassParent, FuncChildFuncParent, ClassChildClassParent, ClassChildFuncParent, FuncChildRefCallbackParent, ClassChildRefCallbackParent, RefDemo } from './container/refDemo'
import { VirtualizedList } from './container/VirtualizedList'
import { VirtualizedGrid } from './container/VirtualizedGrid'
import { VirtualizedTree } from './container/VirtualizedTree'
import { ReactCloneElement } from './container/refDemo/ReactCloneElement'
import { ScrollBar } from './container/ScrollBar'
import { FixedSizeListCustom, VariableSizeListCustom, DynamicSizeListCustom } from './container/VirtualizedListCustom'
import { AIComponent } from './container/AIComponent'
import { SnapShot } from './container/Snapshot'
import './utils/storage'

import { HtmlContainer } from './container/HTMLContainer'
import { InputContainer } from './container/InputContainer'
import { TextAreaUndoRedo } from './container/TextAreaUndoRedo'
import { Foldable } from './container/FoldableImage'

import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

const routers = [
  { path: '/todo-list', name: 'Todo List', component: TodoListContainer },
  { path: '/toast', name: 'Toast', component: ToastContainer },
  { path: '/tooltip', name: 'Tooltip', component: TooltipContainer },
  { path: '/list', name: 'List', component: ListContainer },
  { path: '/ref', name: 'Ref', component: RefDemo },
  { path: '/func-child-class-parent', name: 'Func Child Class Parent', component: FuncChildClassParent },
  { path: '/func-child-func-parent', name: 'Func Child Func Parent', component: FuncChildFuncParent },
  { path: '/class-child-class-parent', name: 'Class Child Class Parent', component: ClassChildClassParent },
  { path: '/class-child-func-parent', name: 'Class Child Func Parent', component: ClassChildFuncParent },
  { path: '/func-child-ref-callback-parent', name: 'Func Child Ref Callback Parent', component: FuncChildRefCallbackParent },
  { path: '/class-child-ref-callback-parent', name: 'Class Child Ref Callback Parent', component: ClassChildRefCallbackParent },
  { path: '/virtualized-list', name: 'Virtualized List', component: VirtualizedList },
  { path: '/virtualized-grid', name: 'Virtualized Grid', component: VirtualizedGrid },
  { path: '/virtualized-tree', name: 'Virtualized Tree', component: VirtualizedTree },
  { path: '/react-clone-element', name: 'React Clone Element', component: ReactCloneElement },
  { path: '/scroll-bar', name: 'Scroll Bar', component: ScrollBar },
  { path: '/fixed-size-list-custom', name: 'Fixed Size List Custom', component: FixedSizeListCustom },
  { path: '/variable-size-list-custom', name: 'Variable Size List Custom', component: VariableSizeListCustom },
  { path: '/dynamic-size-list-custom', name: 'Dynamic Size List Custom', component: DynamicSizeListCustom },
  { path: '/ai-component', name: 'AI Component', component: AIComponent },
  { path: '/html-container', name: 'HTML Container', component: HtmlContainer },
  { path: '/input-container', name: 'Input Container', component: InputContainer },
  { path: '/textarea-undo-redo', name: 'Textarea Undo Redo', component: TextAreaUndoRedo },
  { path: '/foldable', name: 'Foldable', component: Foldable },
  
  // { path: '/snapshot', name: 'Snapshot', component: SnapShot },
]

export const Home = () => {
  return (
    <div style={{ margin: '0 auto'}}>
      <h1>Home</h1>
      {
        routers.map((router, index) => {
          return (
            <div key={index}>
              <Link to={router.path}>{router.name}</Link>
              <br />
            </div>
          )
        })
      }
    </div>
  )
}



function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<Home />} />
        {
          routers.map((router, index) => {
            return (
              <Route key={index} path={router.path} element={<router.component />} />
            )
          })
        }
      </Routes>
    </BrowserRouter>
  )
}
export default App

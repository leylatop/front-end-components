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
import { Editable } from './container/Editable'
import { TableComponent } from './container/TableComponent'
import { PasswordInputListener } from './container/PasswordInputListener'
import { Home } from './container/Home'
import DraggableDivAlongSvgPath from './container/DraggableDivAlongSvgPath'
import SVGPathEditor from './container/SVGPathEditor'
import SVGEditor from './container/SVGEditor'

export const routers = [
  {path: '/', name: 'Home', component: Home },
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
  { path: '/editable', name: 'Editable', component: Editable },
  {path: '/table-component', name: 'Table Component', component: TableComponent},
  {path: '/password-input-listener', name: 'Password Input Listener', component: PasswordInputListener},
  {path: '/draggable-div-along-svg-path', name: 'Draggable Div Along Svg Path', component: DraggableDivAlongSvgPath},
  { path: '/svg-path-editor', name: 'SVG Path Editor', component: SVGPathEditor },
  { path: '/svg-editor', name: 'SVG Editor', component: SVGEditor },
  // { path: '/snapshot', name: 'Snapshot', component: SnapShot },
]

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
import { FixedSizeListCustom, VariableSizeListCustom } from './container/VirtualizedListCustom'
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";


function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo-list" element={<TodoListContainer />} />
        <Route path="/toast" element={<ToastContainer />} />
        <Route path="/tooltip" element={<TooltipContainer />} />
        <Route path="/list" element={<ListContainer />} />
        <Route path="/ref" element={<RefDemo />} />
        <Route path="/func-child-class-parent" element={<FuncChildClassParent />} />
        <Route path="/func-child-func-parent" element={<FuncChildFuncParent />} />
        <Route path="/class-child-class-parent" element={<ClassChildClassParent />} />
        <Route path="/class-child-func-parent" element={<ClassChildFuncParent />} />
        <Route path="/func-child-ref-callback-parent" element={<FuncChildRefCallbackParent />} />
        <Route path="/class-child-ref-callback-parent" element={<ClassChildRefCallbackParent />} />
        <Route path="/virtualized-list" element={<VirtualizedList />} />
        <Route path="/virtualized-grid" element={<VirtualizedGrid />} />
        <Route path="/virtualized-tree" element={<VirtualizedTree />} />
        <Route path="/react-clone-element" element={<ReactCloneElement />} />
        <Route path="/scroll-bar" element={<ScrollBar />} />
        <Route path="/fixed-size-list-custom" element={<FixedSizeListCustom />} />
        <Route path="/variable-size-list-custom" element={<VariableSizeListCustom />} />
      </Routes>
    </BrowserRouter>
  )
}

export const Home = () => {
  return (
    <div style={{ margin: '0 auto'}}>
      <h1>Home</h1>
      <Link to="/todo-list">Todo List</Link>
      <br />
      <Link to="/toast">Toast</Link>
      <br />
      <Link to="/tooltip">Tooltip</Link>
      <br />
      <Link to="/list">List</Link>
      <br />
      <Link to="/ref">Ref</Link>
      <br />
      <Link to="/virtualized-list">Virtualized List</Link>
      <br />
      <Link to="/virtualized-grid">Virtualized Grid</Link>
      <br />
      <Link to="/virtualized-tree">Virtualized Tree</Link>
      <br />
      <Link to="/react-clone-element">React Clone Element</Link>
      <br />
      <Link to="/scroll-bar">Scroll Bar</Link>
      <br />
      <Link to="/fixed-size-list-custom">Fixed Size List Custom</Link>
      <br />
      <Link to="/variable-size-list-custom">Variable Size List Custom</Link>
    </div>
  )
}

export default App

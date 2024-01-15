import { TodoListContainer } from './container/TodoListContainer'
import { ToastContainer } from './container/ToastContainer'
import { TooltipContainer } from './container/TooltipContainer'
import { ListContainer } from './container/List'
import { FuncChildClassParent, FuncChildFuncParent, ClassChildClassParent, ClassChildFuncParent, FuncChildRefCallbackParent, ClassChildRefCallbackParent, RefDemo } from './container/refDemo'
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";


function App() {
  return (
    <div>
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
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export const Home = () => {
  return (
    <div>
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
    </div>
  )
}

export default App

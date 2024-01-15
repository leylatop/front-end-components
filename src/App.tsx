import { TodoListContainer } from './container/TodoListContainer'
import { ToastContainer } from './container/ToastContainer'
import { TooltipContainer } from './container/TooltipContainer'
import { ListContainer } from './container/List'
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
    </div>
  )
}

export default App

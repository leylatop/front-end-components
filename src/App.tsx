import { TodoListContainer } from './container/TodoListContainer'
import { ToastContainer } from './container/ToastContainer'
import { TooltipContainer } from './container/TooltipContainer'
import './App.css'


function App() {
  return (
    <div className='container'>
      <TodoListContainer />
      <ToastContainer />
      <TooltipContainer />
    </div>
  )
}

export default App

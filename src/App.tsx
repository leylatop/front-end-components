import { TodoList } from './components/TodoList'
import './App.css'
import { ToastContainer } from './container/ToastContainer'


function App() {
  return (
    <div className='container'>
      <TodoList />
      <ToastContainer />
    </div>
  )
}

export default App

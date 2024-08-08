import { useState, useRef } from 'react'
import { TodoItem, TodoItemType } from '../components/TodoItem'

const TodoListContainer = () => {
  const list = [{ id: 1, name: 'todo1', isDone: false }, { id: 2, name: 'todo2', isDone: false }]
  const [todoList, setTodoList] = useState(list)
  const inputRef = useRef(null)

  const handleClick = (item: TodoItemType) => {
    const { id } = item
    const newList = todoList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isDone: !item.isDone
        }
      }
      return item
    })
    setTodoList(newList)
  }

  const handleAll = () => {
    const newList = todoList.map(item => {
      return {
        ...item,
        isDone: true
      }
    })
    setTodoList(newList)
  }

  const handleAdd = () => {
    const name = inputRef.current.value
    const newList = [...todoList, { id: todoList.length + 1, name, isDone: false }]
    setTodoList(newList)
    inputRef.current.value = ''
  }
  return (
    <div>
      <button onClick={handleAll}>全部完成</button>
      <div>
        <input ref={inputRef} type="text" />
        <button onClick={handleAdd}>添加</button>
      </div>
      <div className="todo-list">
        {
          todoList.map(item => (<TodoItem key={item.id} item={item} handleClick={handleClick} />))
        }
      </div>
    </div>
  )
}

export {
  TodoListContainer
}

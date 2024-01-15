import { ListContext } from "./context"
import { Item } from "./Item"
import { Completed } from './Completed'
// import { ListContainer } from "./Container"
import { useContext, useEffect, useState } from "react"

export const List = () => {
  const { isCompletedAll, setIsCompletedAll } = useContext(ListContext)
  const [ data, setData ] = useState([
    { id: 1, title: 'Learn React', completed: true },
    { id: 2, title: 'Learn Redux', completed: true },
    { id: 3, title: 'Learn Redux Saga', completed: false }
  ])


  useEffect(() => {
    if(isCompletedAll) {
      setData(data.map(item => ({ ...item, completed: true })))
    }
    //  else {
    //   setData(data.map(item => ({ ...item, completed: false })))
    // }
  }, [isCompletedAll])

  useEffect(() => {
    const isAllCompleted = data.every(item => item.completed)
    setIsCompletedAll(isAllCompleted)
  }, [data, setIsCompletedAll])

  const handleItemClick = (item) => {
    const newData = data.map(i => {
      if(i.id === item.id) {
        return {
          ...item,
          completed: !item.completed
        }
      }
      return i
    })
    setData(newData)
  }
  return (
    <>
      <Completed />
      {
        data.map((item) => <Item key={item.id} item={item} onClick={handleItemClick}/>)
      }
    </>
  )
}


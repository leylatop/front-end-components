
export type TodoItemType = {
  id: number
  name: string
  isDone: boolean
}

type TodoItemProps = {
  item: TodoItemType
  handleClick: (item: TodoItemType) => void
}


export const TodoItem = ({ item, handleClick }: TodoItemProps) => {
  return (
    <div onClick={() => handleClick(item)}>
      {item.isDone ? '✅' : '❌'}
      {item.name}
    </div>
  )
}
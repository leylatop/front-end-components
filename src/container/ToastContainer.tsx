import { useState } from "react"
import { Toast, ToastItem } from "../components/Toast"

const ToastContainer = () => {
  const [toastList, setToastList] = useState([] as ToastItem[])
  const [toastItem, setToastItem] = useState(null as ToastItem | null)

  const handleAddToast = (item) => {
    const nextToastList = [...toastList, item]
    setToastList(nextToastList)
    setToastItem(nextToastList[0])
  }

  const handleRemoveToast = (item) => {
    const nextToastList = toastList.filter(i => i.id !== item.id)
    setToastList(nextToastList)
    setToastItem(nextToastList?.[0] || null)
  }

  if(!toastItem) return <button onClick={() => handleAddToast({ id: Date.now(), message: `hello world ${Date.now()}`, duration: 3000 })}>弹出Toast</button>

  return (
    <>
      <button onClick={() => handleAddToast({ id: Date.now(), message: `hello world ${Date.now()}`, duration: 3000 })}>弹出Toast</button>
      <Toast item={toastItem} removeToast={handleRemoveToast}/>
    </>
  )
}

export {
  ToastContainer
}
import { useCallback, useEffect } from 'react'
import { Portal } from './Portal'
import './Toast.css'

export type ToastItem = {
  message: string
  duration: number
  canClose: boolean

}

type Props = {
  item: ToastItem | null
  removeToast: (item: ToastItem) => void
}

const Toast = ({ item, removeToast }: Props) => {
  const { message, duration, canClose } = item || {}
  const onDisappear = useCallback(() => {
    removeToast && removeToast(item)
  }, [item, removeToast])

  useEffect(() => {
    if (item) {
      let timer: number | null | undefined = null
      if (!canClose) {
        timer = setTimeout(() => {
          onDisappear()
        }, duration)
      }
      return () => {
        timer && clearTimeout(timer)
      }
    }
  }, [canClose, duration, item, onDisappear])

  const handleClose = () => {
    onDisappear()
  }

  return (
    <Portal className="TOAST_CONTAINER">
      {item && (
        <div className={`toast ${item ? 'show' : 'hide'}`}>
          {message}
          <span className="close-icon" onClick={handleClose}>x</span>
        </div>
      )
      }
    </Portal>
  )
}

export {
  Toast
}
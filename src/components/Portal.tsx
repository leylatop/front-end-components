import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
type Props = {
  children: ReactNode | ReactNode[]
  className: string
}

class Portal extends React.Component<Props> {
  container: HTMLDivElement
  constructor (props:Props) {
    super(props)
    this.updateContainer()
  }

  updateContainer () {
    if(this.props.className) {
      const container = document.querySelector(`.${this.props.className}`)
      if (container) {
        this.container = container as HTMLDivElement
      } else {
        this.appendContainer()
      }
    } else {
      this.appendContainer()
    }
  }

  appendContainer () {
    this.container = document.createElement('div')
    if(this.props.className) {
      this.container.className = this.props.className
    }
    document.body.appendChild(this.container)
  }

  componentWillUnmount () {
    document.body.removeChild(this.container)
  }

  render () {
    return createPortal(this.props.children, this.container)
  }
}

export {
  Portal
}
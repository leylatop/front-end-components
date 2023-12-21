import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
type Props = {
  children?: ReactNode | ReactNode[]
  className: string
}
class Portal extends React.Component<Props> {
  container: HTMLDivElement
  static defaultProps = {
    className: 'portal-container'
  }
  constructor (props:Props) {
    super(props)
    this.initContainer()
  }

  initContainer () {
    const className = this.props.className
    const container = document.querySelector(`.${className}`)
    if (container) {
      this.container = container as HTMLDivElement
      return
    }
    this.container = document.createElement('div')
    this.container.className = className
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
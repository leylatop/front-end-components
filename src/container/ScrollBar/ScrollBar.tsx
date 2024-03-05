import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export const BAR_MAP = {
  vertical: { // 垂直滚动条
    offsetSize: 'offsetHeight',
    scrollPosition: 'scrollTop',
    scrollSize: 'scrollHeight',
    clientSize: 'clientHeight',
    scrollDirection: 'scrollY',
    size: 'height',
    client: 'clientY',
    direction: 'top',
    page: 'pageY',
    barClassName: 'bar-vertical',
    thumbClassName: 'thumb-vertical'
  },
  horizontal: { // 水平滚动条
    offsetSize: 'offsetWidth',
    scrollPosition: 'scrollLeft',
    scrollSize: 'scrollWidth',
    clientSize: 'clientWidth',
    scrollDirection: 'scrollX',
    size: 'width',
    client: 'clientX',
    direction: 'left',
    page: 'pageX',
    barClassName: 'bar-horizontal',
    thumbClassName: 'thumb-horizontal'
  }
} as const

type Props = {
  isAutoHideBar: boolean
  className?: string
  scrollContainerClassName?: string
  children: React.ReactNode
}

export const ScrollBar2 = (props: Props) => {
  const { children, isAutoHideBar, className = '', scrollContainerClassName = '' } = props
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <StyledScrollBar2 className={className}>
      <div className={`scroll-container ${scrollContainerClassName}`} ref={containerRef}>
        <div className="scroll-content">
          {children}
        </div>
      </div>
      <Bar
        type="vertical"
        containerRef={containerRef}
        isAutoHideBar={isAutoHideBar}
      />
      <Bar
        type="horizontal"
        containerRef={containerRef}
        isAutoHideBar={isAutoHideBar}
      />
    </StyledScrollBar2>
  )
}

type BarProps = {
  type: 'vertical' | 'horizontal',
  containerRef: React.RefObject<HTMLDivElement>,
  isAutoHideBar: boolean
}

export const Bar = React.memo(function Bar (props: BarProps) {
  const { type, containerRef, isAutoHideBar } = props
  const barRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLDivElement>(null)
  const thumbSizeRef = React.useRef(0)
  const [thumbSize, setThumbSize] = useState(0)
  const [thumbPosition, setThumbPosition] = useState(0)

  const ratioRef = React.useRef(1)
  const isDragging = React.useRef(false)

  const [barOpacity, setBarOpacity] = useState(isAutoHideBar ? 0 : 1)
  const [isShowBar, setIsShowBar] = useState(false)

  // 更新滚动条的尺寸和位置
  const updateScrollGlobal = useCallback(() => {
    const container = containerRef.current
    const bar = barRef.current
    if (!container || !bar) return
    const visibleArea = container[BAR_MAP[type].clientSize]
    const scrollSize = container[BAR_MAP[type].scrollSize]
    const isShowBar = scrollSize > visibleArea
    /**
     * 1. size 滑块的尺寸
     * 2. ratio 是滑块的尺寸和滚动内容的区域的比值
     * 3. position 滑块的位置
     */
    let size, ratio, position
    if (isShowBar) {
      const barSize = bar[BAR_MAP[type].clientSize]
      size = visibleArea / scrollSize * barSize
      ratio = (barSize - size) / (scrollSize - visibleArea)
      position = container[BAR_MAP[type].scrollPosition] * ratio
      // 处理 position 的边界值，不能超过滚动条的最大高度，不能小于0
      position = Math.max(position, 0)
      position = Math.min(position, barSize - size)
    } else {
      size = 0
      ratio = 1
      position = 0
    }

    // 使用ref保存thumbSize，防止在 updateThumbTop 函数中使用的 thumbSize 是旧值
    thumbSizeRef.current = size
    ratioRef.current = ratio
    setThumbSize(size)
    setThumbPosition(position)
    setIsShowBar(isShowBar)
  }, [containerRef, type])

  // 更新滚动条的位置
  const updatePosition = useCallback(() => {
    const container = containerRef.current
    const bar = barRef.current
    const size = thumbSizeRef.current
    if (!container || !bar) return
    const barSize = bar[BAR_MAP[type].clientSize]
    let position = container[BAR_MAP[type].scrollPosition] * ratioRef.current
    position = Math.max(position, 0)
    position = Math.min(position, barSize - size)
    setThumbPosition(position)
  }, [containerRef, type])

  // 判断鼠标是否在滚动容器内
  const getMouseIsInContainer = (e: MouseEvent, container) => {
    const { left, right, top, bottom } = container.getBoundingClientRect()
    return e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom
  }

  // 自动隐藏滚动条逻辑
  const updateBarStatus = useCallback((e: MouseEvent) => {
    const container = containerRef.current
    if (!container) return
    const mouseIsInContainer = getMouseIsInContainer(e, container)
    if (mouseIsInContainer) {
      setBarOpacity(1)
      // 当鼠标移出页面时，也要隐藏滚动条
      document.addEventListener('mouseleave', () => {
        setBarOpacity(0)
      })
    } else {
      // 如果正在拖拽滑块，不隐藏滚动条
      if (isDragging.current) return
      setBarOpacity(0)
    }
  }, [containerRef, isDragging])

  useEffect(() => {
    const container = containerRef.current // 保存当前的ref值
    const children = container?.children
    updateScrollGlobal() // 初始化滚动条所有信息

    const resizeObserver = new ResizeObserver(() => {
      // 尺寸发生变化时，重新计算滚动条所有信息
      updateScrollGlobal()
    })
    if (container) {
      // 监听鼠标移动事件，自动隐藏滚动条
      // @ts-ignore
      if (isAutoHideBar) document.addEventListener('mousemove', updateBarStatus)
      // 监听滚动容器的滚动事件，只需更新滑块的位置
      container.addEventListener('scroll', updatePosition)
      // 同时监听滚动容器和滚动内容的大小变化，更新滑块的大小和位置
      resizeObserver.observe(container)
    }
    if (children) {
      resizeObserver.observe(children[0] as HTMLElement)
    }

    return () => {
      resizeObserver.disconnect()
      if (container) {
        container.removeEventListener('scroll', updatePosition)
      }
      // @ts-ignore
      if (isAutoHideBar) document.removeEventListener('mousemove', updateBarStatus)
    }
  }, [containerRef, isAutoHideBar, type, updateBarStatus, updatePosition, updateScrollGlobal])

  // 滑块的拖拽事件处理函数
  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault()
    if (!thumbRef.current || !containerRef.current) return
    const lastedPagePosition = e[BAR_MAP[type].page]
    const lastedScrollPosition = containerRef.current[BAR_MAP[type].scrollPosition] * ratioRef.current
    let scrollPosition
    const mouseMoveHandler = (e) => {
      isDragging.current = true
      const moveDelta = e[BAR_MAP[type].page] - lastedPagePosition
      const sliderPosition = lastedScrollPosition + moveDelta
      scrollPosition = sliderPosition / ratioRef.current
      containerRef.current[BAR_MAP[type].scrollPosition] = scrollPosition
      updatePosition()
    }

    document.addEventListener('mousemove', mouseMoveHandler)

    document.addEventListener('mouseup', () => {
      if (isDragging.current) {
        isDragging.current = false
      }
      document.removeEventListener('mousemove', mouseMoveHandler)
    })
  }, [containerRef, type, updatePosition])

  // 滚动条的点击事件处理函数
  const handleBarMouseDown = useCallback((e) => {
    e.preventDefault()
    if (!barRef.current || !thumbRef.current || !containerRef.current) return
    if (e.target !== thumbRef.current) {
      const offset = e[BAR_MAP[type].page] - barRef.current.getBoundingClientRect()[BAR_MAP[type].direction] - window[BAR_MAP[type].scrollDirection]
      const scrollPosition = (offset - thumbRef.current[BAR_MAP[type].clientSize] / 2) / ratioRef.current
      containerRef.current[BAR_MAP[type].scrollPosition] = scrollPosition
      updatePosition()
    }
  }, [containerRef, type, updatePosition])

  const barStyle = {
    opacity: isShowBar ? barOpacity : 0
  }

  const thumbStyle = {
    [BAR_MAP[type].direction]: thumbPosition,
    [BAR_MAP[type].size]: thumbSize
  }

  const barClassName = BAR_MAP[type].barClassName
  const thumbClassName = BAR_MAP[type].thumbClassName
  return (
    <StyledScrollBar className={barClassName} ref={barRef} style={barStyle} onMouseDown={handleBarMouseDown}>
      <StyledThumb className={thumbClassName} ref={thumbRef} style={thumbStyle} onMouseDown={handleThumbMouseDown} />
    </StyledScrollBar>
  )
})

const StyledScrollBar = styled.div`
  position: absolute;

  &.bar-vertical {
    right: 0;
    top: 0;
    width: 10px;
    height: 100%;
  }

  &.bar-horizontal {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
  }
`

const StyledThumb = styled.div`
  position: absolute;
  transition: 0.3s background-color;
  background-color: red;
  border-radius: 4px;

  &.thumb-vertical {
    top: 0;
    right: 0;
    width: 6px;
  }

  &.thumb-horizontal {
    bottom: 0;
    left: 0;
    height: 6px;
  }
`

const StyledScrollBar2 = styled.div`
  position: relative;

  .scroll-container {
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
    scrollbar-width: none;
  }
`

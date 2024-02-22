import React, { MouseEvent, useEffect } from 'react'
import styled from 'styled-components'

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
} as const


export const ScrollBar2 = (props) => {
  const { children, isAutoHideBar, className = '', scrollContainerClassName = '' } = props
  const containerRef = React.useRef<HTMLDivElement>(null)
  const barRef = React.useRef<HTMLDivElement>(null)
  const barHorizontalRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  const thumbRef = React.useRef<HTMLDivElement>(null)
  const thumbHorizontalRef = React.useRef<HTMLDivElement>(null)

  const isDragging = React.useRef(false)
  const thumbSizeRef = React.useRef(0)
  const thumbHorizontalSizeRef = React.useRef(0)

  const ratioRef = React.useRef(1)
  const ratioHorizontalRef = React.useRef(1)

  const [scrollThumbHeight, setScrollThumbHeight] = React.useState(0)
  const [scrollThumbHorizontalWidth, setScrollThumbHorizontalWidth] = React.useState(0)

  const [scrollThumbTop, setScrollThumbTop] = React.useState(0)
  const [scrollThumbLeft, setScrollThumbLeft] = React.useState(0)

  const [scrollBarOpacity, setScrollBarOpacity] = React.useState<number>(0)
  const [isShowVerticalBar, setIsShowVerticalBar] = React.useState<boolean>(false)
  const [isShowHorizontalBar, setIsShowHorizontalBar] = React.useState<boolean>(false)

  // 计算滑块的位置
  const calcThumbTop = (thumbHeight: number) => {
    const { scrollTop } = containerRef.current!
    const barHeight = barRef.current!.clientHeight
    let thumbTop = scrollTop * ratioRef.current
    // 处理 thumbTop 的边界值，不能超过滚动条的最大高度，不能小于0
    thumbTop = Math.max(thumbTop, 0)
    thumbTop = Math.min(thumbTop, barHeight - thumbHeight)
    return thumbTop
  }


  // 计算水平滑块的位置
  const calcThumbLeft = (thumbWidth: number) => {
    const { scrollLeft } = containerRef.current!
    const barWidth = barHorizontalRef.current!.clientWidth
    let thumbLeft = scrollLeft * ratioHorizontalRef.current
    // 处理 thumbTop 的边界值，不能超过滚动条的最大高度，不能小于0
    thumbLeft = Math.max(thumbLeft, 0)
    thumbLeft = Math.min(thumbLeft, barWidth - thumbWidth)
    return thumbLeft
  }



  // 更新滑块的位置
  const updateThumbTop = () => {
    const thumbTop = calcThumbTop(thumbSizeRef.current)
    setScrollThumbTop(thumbTop)
  }

  // 更新水平滑块的位置
  const updateThumbLeft = () => {
    const thumbLeft = calcThumbLeft(thumbHorizontalSizeRef.current)
    setScrollThumbLeft(thumbLeft)
  }


  // 更新滑块的大小和比例
  const updateSizeAndRatio = () => {
    const { clientHeight: visibleHeight, scrollHeight } = containerRef.current!
    const barHeight = barRef.current!.clientHeight
    // size 是滑块的高度
    const size = visibleHeight / scrollHeight * barHeight
    // ratio 是滑块的高度和滚动内容的高度的比值
    const ratio = (barHeight - size) / (scrollHeight - visibleHeight)
    // 使用ref保存thumbSize，防止在 updateThumbTop 函数中使用的 thumbSize 是旧值
    thumbSizeRef.current = size
    ratioRef.current = ratio
    setScrollThumbHeight(size)
  }

  // 更新水平滑块的大小和比例
  const updateHorizontalSizeAndRatio = () => {
    const { clientWidth: visibleWidth, scrollWidth } = containerRef.current!
    const barWidth = barHorizontalRef.current!.clientWidth
    // size 是滑块的宽度
    const size = visibleWidth / scrollWidth * barWidth

    // ratio 是滑块的高度和滚动内容的高度的比值
    const ratio = (barWidth - size) / (scrollWidth - visibleWidth)
    // 使用ref保存thumbSize，防止在 updateThumbLeft 函数中使用的 thumbSize 是旧值
    thumbHorizontalSizeRef.current = size
    ratioHorizontalRef.current = ratio
    setScrollThumbHorizontalWidth(size)
  }

  // 滑块的拖拽事件处理函数
  const handleThumbMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (!thumbRef.current || !containerRef.current) return
    const lastedPageY = e.pageY
    const lastedScrollTop = containerRef.current.scrollTop * ratioRef.current
    let scrollTop
    const mouseMoveHandler = (e: { pageY: number }) => {
      isDragging.current = true
      const moveDelta = e.pageY - lastedPageY
      const sliderTop = lastedScrollTop + moveDelta
      scrollTop = sliderTop / ratioRef.current
      containerRef.current!.scrollTop = scrollTop
      updateThumbTop()
    }

    document.addEventListener('mousemove', mouseMoveHandler)

    document.addEventListener('mouseup', () => {
      if (isDragging.current) {
        isDragging.current = false
      }
      document.removeEventListener('mousemove', mouseMoveHandler)
    })
  }

  // 水平滑块的拖拽事件处理函数
  const handleBarHorizontalThumbMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (!thumbHorizontalRef.current || !containerRef.current) return
    const lastedPageX = e.pageX
    const lastedScrollLeft = containerRef.current.scrollLeft * ratioHorizontalRef.current
    let scrollLeft
    const mouseMoveHandler = (e: { pageX: number }) => {
      isDragging.current = true
      const moveDelta = e.pageX - lastedPageX
      const sliderLeft = lastedScrollLeft + moveDelta
      scrollLeft = sliderLeft / ratioHorizontalRef.current
      containerRef.current!.scrollLeft = scrollLeft
      updateThumbLeft()
    }

    document.addEventListener('mousemove', mouseMoveHandler)

    document.addEventListener('mouseup', () => {
      if (isDragging.current) {
        isDragging.current = false
      }
      document.removeEventListener('mousemove', mouseMoveHandler)
    })
  }

  // 滚动条的点击事件处理函数
  const handleBarMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!barRef.current || !thumbRef.current || !containerRef.current) return
    if (e.target !== thumbRef.current) {
      const offsetY = e.pageY - barRef.current.getBoundingClientRect().top - window.scrollY
      const scrollTop = (offsetY - thumbRef.current.clientHeight / 2) / ratioRef.current
      containerRef.current.scrollTop = scrollTop
      updateThumbTop()
    }
  }

  // 水平滚动条的点击事件处理函数
  const handleHorizontalBarMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!barHorizontalRef.current || !thumbHorizontalRef.current || !containerRef.current) return
    if (e.target !== thumbHorizontalRef.current) {
      const offsetX = e.pageX - barHorizontalRef.current.getBoundingClientRect().left - window.scrollX
      const scrollLeft = (offsetX - thumbHorizontalRef.current.clientWidth / 2) / ratioHorizontalRef.current
      containerRef.current.scrollLeft = scrollLeft
      updateThumbLeft()
    }
  }

  // 自动隐藏滚动条
  const updateBarStatus = (e: MouseEvent) => {
    if (containerRef.current) {
      const { left, right, top, bottom } = containerRef.current.getBoundingClientRect();
      const isInContainer = (e: MouseEvent) => {
        return e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom;
      }
      if (isInContainer(e)) {
        setScrollBarOpacity(1)

        // 当鼠标移出页面时，也要隐藏滚动条
        document.addEventListener('mouseleave', () => {
          setScrollBarOpacity(0)
        })
      } else {
        // 如果正在拖拽滑块，不隐藏滚动条
        if (isDragging.current) return
        setScrollBarOpacity(0)
      }
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const isShowVerticalBar = containerRef.current!.scrollHeight > containerRef.current!.clientHeight
      const isShowHorizontalBar = containerRef.current!.scrollWidth > containerRef.current!.clientWidth
      setIsShowVerticalBar(isShowVerticalBar)
      setIsShowHorizontalBar(isShowHorizontalBar)
      if (isShowVerticalBar) {
        updateSizeAndRatio()
      }
      if (isShowHorizontalBar) {
        updateHorizontalSizeAndRatio()
      }

      if (isAutoHideBar) {
        document.addEventListener('mousemove', updateBarStatus)
      }
      // 监测滚动容器的滚动事件，更新滑块的位置
      containerRef.current.addEventListener('scroll', updateThumbTop)
      // 监测滚动容器的大小变化，更新滑块的大小和位置
      const resizeCallback = () => {
        updateSizeAndRatio()
        updateHorizontalSizeAndRatio()
        updateThumbTop()
        updateThumbLeft()

      }
      // 监听窗口大小变化，更新滑块的大小和位置
      window.addEventListener('resize', resizeCallback)
      // 监听滚动容器的大小变化，更新滑块的大小和位置
      const resizeObserver = new ResizeObserver(resizeCallback)
      resizeObserver.observe(contentRef.current!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const barStyle = {
    opacity: isShowVerticalBar ? scrollBarOpacity : 0,
  }
  const barHorizontalStyle = {
    opacity: isShowHorizontalBar ? scrollBarOpacity : 0,
  }
  const thumbStyle = {
    height: scrollThumbHeight,
    top: scrollThumbTop
  }

  const thumbHorizontalStyle = {
    width: scrollThumbHorizontalWidth,
    left: scrollThumbLeft
  }


  return (
    <StyledScrollBar2 className={className}>
      <div className={`scroll-container ${scrollContainerClassName}`} ref={containerRef}>
        <div className="scroll-content" ref={contentRef}>
          {children}
        </div>
      </div>
      <div className="bar" ref={barRef} style={barStyle} onMouseDown={handleBarMouseDown}>
        <div className="thumb" ref={thumbRef} style={thumbStyle} onMouseDown={handleThumbMouseDown}></div>
      </div>
      <div className="bar-v" ref={barHorizontalRef} style={barHorizontalStyle} onMouseDown={handleHorizontalBarMouseDown}>
        <div className="thumb-v" ref={thumbHorizontalRef} style={thumbHorizontalStyle} onMouseDown={handleBarHorizontalThumbMouseDown}></div>
      </div>

    </StyledScrollBar2>
  )
}

const StyledScrollBar2 = styled.div`
  position: relative;

  .scroll-container {
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
    scrollbar-width: none;
    background-color: aqua;
  }

  .bar {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
  }

  .bar-v {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px;
  }

  .thumb {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    border-radius: 10px;
    transition: 0.3s background-color;
    background-color: #888;

    &:hover {
      background-color: #555;
    }
  }

  .thumb-v {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 6px;
    border-radius: 10px;
    transition: 0.3s background-color;
    background-color: #888;

    &:hover {
      background-color: #555;
    }
  }
`

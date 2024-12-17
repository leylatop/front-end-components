import React, { Component } from 'react'
import paper from 'paper/dist/paper-core';

import { StyledPencilDraw } from './styles'
import { smoothControlPoints } from './utils'

const transformPoint = function (x, y, m) {
  return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }
}
export const RULER_WIDTH = 0
const wrapperStyle = {
  top: RULER_WIDTH,
  left: RULER_WIDTH,
  pointerEvents: 'auto'
}

const svgStyle = {
  top: -RULER_WIDTH,
  left: -RULER_WIDTH
}
const smoothPointsToPathD = function (points) {
  const N = points.numberOfItems
  if (N >= 4) {
    // loop through every 3 points and convert to a cubic bezier curve segment
    //
    // NOTE: this is cheating, it means that every 3 points has the potential to
    // be a corner instead of treating each point in an equal manner.  In general,
    // this technique does not look that good.
    //
    // I am open to better ideas!
    //
    // Reading:
    // - http://www.efg2.com/Lab/Graphics/Jean-YvesQueinecBezierCurves.htm
    // - http://www.codeproject.com/KB/graphics/BezierSpline.aspx?msg=2956963
    // - http://www.ian-ko.com/ET_GeoWizards/UserGuide/smooth.htm
    // - http://www.cs.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/bezier-der.html
    let curpos = points.getItem(0); let prevCtlPt = null
    let d = []
    d.push(['M', curpos.x, ',', curpos.y, ' C'].join(''))
    for (let i = 1; i <= (N - 4); i += 3) {
      let ct1 = points.getItem(i)
      const ct2 = points.getItem(i + 1)
      const end = points.getItem(i + 2)

      // if the previous segment had a control point, we want to smooth out
      // the control points on both sides
      if (prevCtlPt) {
        const newpts = smoothControlPoints(prevCtlPt, ct1, curpos)
        if (newpts && newpts.length === 2) {
          const prevArr = d[d.length - 1].split(',')
          prevArr[2] = newpts[0].x
          prevArr[3] = newpts[0].y
          d[d.length - 1] = prevArr.join(',')
          ct1 = newpts[1]
        }
      }
      d.push([ct1.x, ct1.y, ct2.x, ct2.y, end.x, end.y].join(','))

      curpos = end
      prevCtlPt = ct2
    }
    // handle remaining line segments
    d.push('L')
    for (let i = 1; i < N; ++i) {
      const pt = points.getItem(i)
      d.push([pt.x, pt.y].join(','))
    }
    d = d.join(' ')
    return d
    // const svgRoot = document.getElementById('svgRoot')
    // const path = svgRoot.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'path')
    // path.setAttribute('d', d)
    // path.setAttribute('fill', 'none')
    // path.setAttribute('stroke', 'black')
    // svgRoot.appendChild(path)
    // svgRoot.removeChild(element)
    // // create new path element
    // element = addSvgElementFromJson({
    //   "element": "path",
    //   "curStyles": true,
    //   "attr": {
    //     "id": getId(),
    //     "d": d,
    //     "fill": "none"
    //   }
    // });
    // No need to call "changed", as this is already done under mouseUp
  }
}
export default class SvgEditorBasePaperJS extends Component {
  state = {
    pointsData: [],
    isDrawing: false
  }
  svgRef = React.createRef()
  polylineRef = React.createRef()
  componentDidMount(): void {
    paper.setup(document.createElement('canvas'));

    this.path = new paper.Path({
      fillColor: 'red',
      closed: false
    })  
  }

  handleMouseDown = (e) => {
    console.log('svgcontainer--handleMouseDown')
    this.setState({ isDrawing: true })
    const svg = this.svgRef.current as SVGSVGElement
    if (!svg) return
    // 获得svg的矩阵
    const matrix = svg.getScreenCTM()?.inverse()
    if (!matrix) return
    const x = e.clientX
    const y = e.clientY

    // 获得svg的矩阵
    const point = transformPoint(x, y, matrix)
    if (!this.polylineRef.current) return
    const polyline = this.polylineRef.current as SVGPolylineElement
    polyline.setAttribute('points', `${point.x},${point.y}`)
    polyline.setAttribute('stroke', 'black')
    polyline.setAttribute('fill', 'none')
    this.path.add(new paper.Segment(new paper.Point(point.x, point.y)))
  }
  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return
    // console.log('handleMouseMove')
    const svg = this.svgRef.current as SVGSVGElement
    const polyline = this.polylineRef.current as SVGPolylineElement
    if (!svg || !polyline) return
    const matrix = svg.getScreenCTM()?.inverse()
    const x = e.clientX
    const y = e.clientY
    const point = transformPoint(x, y, matrix)
    const points = polyline.getAttribute('points')
    const newPoints = `${points} ${point.x},${point.y}`
    polyline.setAttribute('points', newPoints)
    this.path.add(new paper.Segment(new paper.Point(point.x, point.y)))
  }
  handleMouseUp = (e) => {
    console.log('handleMouseUp')
    console.log(this.path)

    if (!this.state.isDrawing) return
    const polyline = this.polylineRef.current as SVGPolylineElement
    if (!polyline) return
    // polyline.setAttribute('stroke', 'black')
    // polyline.setAttribute('fill', 'none')

    const points = polyline.getAttribute('points') || ''
    const commaIndex = points.indexOf(',')
    let keep = false
    if (commaIndex >= 0) {
      keep = points.indexOf(',', commaIndex + 1) >= 0
    } else {
      keep = points.indexOf(' ', points.indexOf(' ') + 1) >= 0
    }
    // if (keep) {
    //   const d = smoothPointsToPathD(this.polylineRef.current?.points)
    //   if (!d) return
    //   const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    //   path.setAttribute('d', d)
    //   path.setAttribute('fill', 'none')
    //   path.setAttribute('stroke', 'black')
    //   this.svgRef.current?.appendChild(path)
    //   // path 不自动闭合
    //   path.setAttribute('stroke-linecap', 'square')
    //   polyline.setAttribute('points', '')
    // }
    this.path?.simplify(5)
    // 立即应用路径
    const pathValue = this.immediateApplyPath()
    const d2 = this.pathValueToD(pathValue)
    console.log('d2', d2)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d2)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', 'black')
    this.svgRef.current?.appendChild(path)
    polyline.setAttribute('points', '')

    console.log('pathValue', pathValue)
    this.setState({ isDrawing: false })

  }

  pathValueToD = (pathValue) => {
    const { data } = pathValue
    const formatNumber = (num: number) => {
        return num.toFixed(0)
    }
    
    // 修改路径字符串生成逻辑
    let d = `M${formatNumber(data[0].point.x)},${formatNumber(data[0].point.y)}`
    
    for (let i = 1; i < data.length; i++) {
        const segment = data[i]
        d += ` C${formatNumber(segment.handleIn.x)},${formatNumber(segment.handleIn.y)} ${formatNumber(segment.handleOut.x)},${formatNumber(segment.handleOut.y)} ${formatNumber(segment.point.x)},${formatNumber(segment.point.y)}`
    }
    
    return d
  }

//   pathValueToD = (pathValue) => {
//     const { data, closed } = pathValue
//     const formatNumber = (num: number) => {
//       return num.toFixed(0)
//     }
//     const d = data.map(({ point, handleIn, handleOut }) => {
//       return `M${formatNumber(point.x)},${formatNumber(point.y)} C${formatNumber(handleIn.x)},${formatNumber(handleIn.y)} ${formatNumber(handleOut.x)},${formatNumber(handleOut.y)}`
//     }).join(' ')
//     return d
//   }

  applyInverse = (viewport: {
    offset: {
      x: number;
      y: number;
    };
    scale: number;
  }, pos: {
    x: number;
    y: number;
  }) => {
    const {
      x,
      y
    } = pos;
    const {
      offset,
      scale
    } = viewport;
    const worldX = (x - offset.x) / scale;
    const worldY = (y - offset.y) / scale;
    return {
      x: worldX,
      y: worldY
    };
  }
  
  pathValueToVector = (pathValue: PathValue) => {
    const { data, closed } = pathValue
    // 1. 先转成世界坐标
    // 2. 再转成相对原点的坐标
    let origin: Point
    const viewport = {
      offset: {
        x: -1320.9751640867041,
        y: -545.1192542132932
      },
      scale: 1
    }
    const points = data.map(({ point: e, handleIn: t, handleOut: o }, _index) => {
      const worldPoint = this.applyInverse(viewport, e)
      const worldHandleIn = this.applyInverse(viewport, t)
      const worldHandleOut = this.applyInverse(viewport, o)
      if(_index === 0) {
        origin = worldPoint
      }
      const relativePoint = {
        x: worldPoint.x - origin.x,
        y: worldPoint.y - origin.y
      }
      const relativeHandleIn = {
        x: worldHandleIn.x - origin.x,
        y: worldHandleIn.y - origin.y
      }
      const relativeHandleOut = {
        x: worldHandleOut.x - origin.x,
        y: worldHandleOut.y - origin.y
      }
      return {
        "type": "mirrored",
        "radius": 0,
        "prev": relativeHandleIn,
        "next": relativeHandleOut,
        "x": relativePoint.x,
        "y": relativePoint.y
      }
    })

    return {
      points,
      closed
    }
  }

  pathToPathValue = (path: paper.Path) => {
    return {
      closed: !!path.closed,
      data: path.segments.map(({ point, handleOut, handleIn }) => ({
        point: {
          x: point.x,
          y: point.y
        },
        handleIn: {
          x: handleIn.x,
          y: handleIn.y
        },
        handleOut: {
          x: handleOut.x,
          y: handleOut.y
        }
      }))
    }
  }
  
  immediateApplyPath = () => {
    if(!this.path || !this.path.segments) return

    const pathValue = this.pathToPathValue(this.path.clone())
    return pathValue
    // console.log('pathValue', pathValue)
    // const vector = this.pathValueToVector(pathValue)
    // console.log('vector', vector)
    // return pathValue
  }

  render () {
    const cursorStyle = 'init-cursor'
    return (
      <StyledPencilDraw className={`${cursorStyle} pencil-draw-container` } style={wrapperStyle}>
        <svg ref={this.svgRef} className="vector-container" style={svgStyle}
          onMouseDown={this.handleMouseDown}
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseUp={this.handleMouseUp}
        >
          <polyline ref={this.polylineRef} />
        </svg>
      </StyledPencilDraw>
    )
  }
}

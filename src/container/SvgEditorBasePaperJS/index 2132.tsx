import { Component, createRef, RefObject } from 'react';
import paper from 'paper/dist/paper-core';

interface Props {

}

interface PathValue {
  closed: boolean;
  data: Array<{
    point: Point;
    handleIn: Point;
    handleOut: Point;
  }>;
}

interface Point {
  x: number;
  y: number;
}


export default class SvgEditorBasePaper extends Component<Props> {
  private tolerance: number = 5;
  private canvas: RefObject<HTMLCanvasElement>;
  private path?: paper.Path;
  private svgRef: RefObject<SVGSVGElement>;

  constructor(props: Props) {
    super(props);
    this.canvas = createRef();
    this.svgRef = createRef();
  }

  handleMouseDown = (e: paper.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // this.props.onActiveArtboardChange()
    this.path = new paper.Path({
      segments: [e.point],
      fullySelected: !0
    })
    // e.event && 0 !== e.event.button || e.point && (this.path = new paper.Path({
    //   segments: [e.point],
    //   fullySelected: !0
    // }),
    // this.props.coreEditor.clearSelected(),
    this.forceUpdate()
  }

  handleMouseDrag = (e: paper.MouseEvent & MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(e.event && e.event.button !== 0 || e.point) {
      this.path?.add(e.point)
      this.forceUpdate()
    }
  }

  handleMouseUp = (e: paper.MouseEvent & MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.event && 0 !== e.event.button || e.point) {
      this.autoClose()
    }
    this.path?.simplify(this.tolerance)
    this.immediateApplyPath()
    // 清空路径
    this.path = new paper.Path()
    this.forceUpdate()
  }

  componentDidMount() {
    if (!this.canvas.current) {
      throw new Error("没有设置画布和窗口元素");
    }

    paper.setup(this.canvas.current);

    const { width, height } = this.canvas.current.getBoundingClientRect();
    paper.view.viewSize = new paper.Size(width, height);

    this.renderPath();
    paper.view.onMouseDown = this.handleMouseDown;
    paper.view.onMouseDrag = this.handleMouseDrag;
    paper.view.onMouseUp = this.handleMouseUp;
  }

  componentWillUnmount() {
    paper.view.onMouseDown = null;
    paper.view.onMouseDrag = null;
    paper.view.onMouseUp = null;
  }

  renderPath = () => {
    this.path ? this.path.remove() : null
    this.path = new paper.Path()
    this.forceUpdate()
  }

  autoClose = () => {
    if(!this.path) return
    const segmentsLength = this.path.segments?.length || 0
    if (segmentsLength > 2) {
      const { firstSegment, lastSegment } = this.path;

      if(firstSegment.point.isClose(lastSegment.point, 4)) {
        this.path.closed = !0
        this.forceUpdate()
      }
    }
  }
  
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
      // const worldPoint = this.applyInverse(viewport, e)
      // const worldHandleIn = this.applyInverse(viewport, t)
      // const worldHandleOut = this.applyInverse(viewport, o)

      const worldPoint = e
      const worldHandleIn = t
      const worldHandleOut = o
      
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
    console.log('pathValue', pathValue)
    // const vector = this.pathValueToVector(pathValue)
    // console.log('vector', vector)
    // return pathValue
    const d = this.pathValueToD(pathValue)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', 'black')
    path.setAttribute('stroke-linecap', 'square')
    this.svgRef.current?.appendChild(path)
  }

  // pathValueToD = (pathValue) => {
  //   const { data } = pathValue
  //   const formatNumber = (num: number) => {
  //       return num.toFixed(0)
  //   }
    
  //   // 修改路径字符串生成逻辑
  //   let d = `M${formatNumber(data[0].point.x)},${formatNumber(data[0].point.y)}`
    
  //   for (let i = 1; i < data.length; i++) {
  //       const segment = data[i]
  //       d += ` C${formatNumber(segment.handleIn.x)},${formatNumber(segment.handleIn.y)} ${formatNumber(segment.handleOut.x)},${formatNumber(segment.handleOut.y)} ${formatNumber(segment.point.x)},${formatNumber(segment.point.y)}`
  //   }
    
  //   return d
  // }
  pathValueToD = (pathValue) => {
    const { data } = pathValue
    const formatNumber = (num: number) => {
        return num.toFixed(0)
    }
    
    // 从第一个点开始
    let d = `M${formatNumber(data[0].point.x)},${formatNumber(data[0].point.y)}`
    
    // 遍历到倒数第二个点
    for (let i = 0; i < data.length - 1; i++) {
        const currentSegment = data[i]
        const nextSegment = data[i + 1]
        
        d += ` C${formatNumber(currentSegment.handleIn.x)},${formatNumber(currentSegment.handleIn.y)} ${formatNumber(currentSegment.handleOut.x)},${formatNumber(currentSegment.handleOut.y)}`
        if(nextSegment) {
          d+=` ${formatNumber(nextSegment.point.x)},${formatNumber(nextSegment.point.y)}`
        }
    }
    
    return d
  }

  renderSVG = () => {
    if (!this.path) return;
    const pathStyle = {
      strokeWidth: 1,
      stroke: 'red',
      fill: "transparent",
      strokeLinecap: "square"
    };
    const path = this.path.clone({
      insert: false
    })
    
    return (
      <div className="svg-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
        <svg ref={this.svgRef} version="1.2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <g>
            <path d={path.pathData} style={pathStyle} />
          </g>
        </svg>
      </div>
    )
  }
  render() {
    return (
      <div
        className="pencil-editor-layer"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <canvas ref={this.canvas} width={800} height={800} style={{ opacity: 0 }} />
        {this.renderSVG()}
      </div>
    );
  }
} 
import React, { Component, createRef, RefObject } from 'react';
import paper from 'paper';
// import { isControlKeyPressed } from '@/utils/keyboard';
// import { KeyCodes } from '@/constants/keyCodes';
// import { getLibByShortCutOrType } from '@/utils/componentLib';
// import { parseColorToString } from '@/utils/color';
// import { DefaultStrokeColor } from '@/constants/styles';

interface Props {
  matrix?: paper.Matrix;
  // onCursorChange: (selected: boolean, cursor: string) => void;
  onStopEditor: () => void;
  onStartAddComponentOperationByKeyDown?: (e: KeyboardEvent) => void;
  onActiveArtboardChange: () => void;
  coreEditor: {
    clearSelected: () => void;
  };
  onImmediateApplyPath?: (
    pathValue: PathValue,
    bounds: Bounds,
    rotatedCompCenter: Point
  ) => void;
  onWorkspaceFocus: () => void;
}

interface State {
  matrix?: paper.Matrix;
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

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export default class SvgEditorBasePaper extends Component<Props, State> {
  private tolerance: number = 5;
  // private isCtrl: boolean = false;
  // private isShift: boolean = false;
  // private isAlt: boolean = false;
  private canvas: RefObject<HTMLCanvasElement>;
  private svg: RefObject<SVGSVGElement>;
  private path?: paper.Path;
  private matrix!: paper.Matrix;
  // private animateID?: number;

  constructor(props: Props) {
    super(props);
    this.canvas = createRef();
    this.svg = createRef();
    this.state = {
      matrix: props.matrix
    };
  }

  handleMouseDown = (e: MouseEvent) => {
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

  handleMouseDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if(e.event && e.event.button !== 0 || e.point) {
      this.path?.add(e.point)
      this.forceUpdate()
    }
  }

  handleMouseUp = (e) => {
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

    // paper.install(window);
    paper.setup(this.canvas.current);

    const { width, height } = this.canvas.current.getBoundingClientRect();
    paper.view.viewSize = new paper.Size(width, height);

    this.renderPath();
    paper.settings.handleSize = 7;

    paper.view.onMouseDown = this.handleMouseDown;
    paper.view.onMouseDrag = this.handleMouseDrag;
    paper.view.onMouseUp = this.handleMouseUp;

    // window.addEventListener("keydown", this.handleKeyDown);
    // window.addEventListener("keyup", this.handleKeyUp);
    // window.addEventListener("resize", this.onResize);

    // this.props.onWorkspaceFocus();
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.onResize);
    // window.removeEventListener("keydown", this.handleKeyDown);
    // window.removeEventListener("keyup", this.handleKeyUp);
    // this.props.onCursorChange(false, "default");
    paper.view.onMouseDown = null;
    paper.view.onMouseDrag = null;
    paper.view.onMouseUp = null;
  }

  // 其他方法保持不变,只需要添加类型注解
  // private scaleBy = (scale: number) => {
  //   this.matrix.scale(scale);
  //   this.path?.matrix.scale(scale);
  //   if (this.path) {
  //     this.path.strokeWidth *= scale;
  //   }
  // };

  // private translateBy = (x: number, y: number) => {
  //   this.matrix.translate(x, y);
  //   this.path?.matrix.translate(x, y);
  // };

  UNSAFE_componentWillReceiveProps() {
    // this.props.onCursorChange(!1, "Pencil")
  }
  // get bounds() {
  //   var e;
  //   const t = null === (e = this.path) || void 0 === e ? void 0 : e.bounds;
  //   return {
  //     left: t.left,
  //     top: t.top,
  //     right: t.right,
  //     bottom: t.bottom,
  //     width: t.width,
  //     height: t.height
  //   }
  // }
  renderPath = () => {
    // var e;
    // null === (e = this.path) || void 0 === e || e.remove(),
    //   this.path = new paper.Path();
    // const { matrix: t } = this.state;
    // if (t) {
    //   const { m11: e, m12: o, m21: n, m22: i, m31: s, m32: r } = t;
    //   this.matrix = new paper.Matrix(e, o, n, i, s, r)
    // } else
    //   this.matrix = new paper.Matrix();
    // this.path.matrix = this.matrix.clone(),
    //   this.forceUpdate()
    
    this.path ? this.path.remove() : null
    this.path = new paper.Path()
    const { matrix } = this.state;
    if (matrix) {
      const { m11: e, m12: o, m21: n, m22: i, m31: s, m32: r } = matrix;
      this.matrix = new paper.Matrix(e, o, n, i, s, r)
    } else {
      this.matrix = new paper.Matrix()
    }
    this.path.matrix = this.matrix.clone()
    this.forceUpdate()
  }

  autoClose = () => {
    var e, t;
    const o = (null === (t = null === (e = this.path) || void 0 === e ? void 0 : e.segments) || void 0 === t ? void 0 : t.length) || 0;
    if (this.path && o > 2) {
      const { firstSegment: e, lastSegment: t } = this.path;
      e.point.isClose(t.point, 4) && (this.path.closed = !0,
        this.forceUpdate())
    }
  }
  pathToPathValue = (e: paper.Path) => {
    return {
      closed: !!e.closed,
      data: e.segments.map((({ point: e, handleOut: t, handleIn: o }) => ({
        point: {
          x: (null == e ? void 0 : e.x) || 0,
          y: (null == e ? void 0 : e.y) || 0
        },
        handleIn: {
          x: (null == o ? void 0 : o.x) || 0,
          y: (null == o ? void 0 : o.y) || 0
        },
        handleOut: {
          x: (null == t ? void 0 : t.x) || 0,
          y: (null == t ? void 0 : t.y) || 0
        }
      })))
    }
  }
  // doTransPathToPathValue = () => {
  //   var e, t, o;
  //   if (this.path) {
  //     const n = this.path
  //       , i = n.clone({
  //         insert: false
  //       })
  //       , { top: a, left: s } = null === (e = i.bounds) || void 0 === e ? void 0 : e.clone()
  //       , r = n.clone()
  //       , l = r.bounds
  //       , c = l.center;
  //     r.rotate(-this.matrix.rotation, c);
  //     const d = r.bounds.center;
  //     r.rotate(this.matrix.rotation, d);
  //     const h = r.bounds
  //       , p = {
  //         x: l.left - h.left,
  //         y: l.top - h.top
  //       }
  //       , u = {
  //         left: d.x + p.x,
  //         top: d.y + p.y
  //       }
  //       , m = null === (t = this.matrix) || void 0 === t ? void 0 : t.clone().invert();
  //     i.pivot = null === (o = i.bounds) || void 0 === o ? void 0 : o.topCenter,
  //       m && (i.matrix = m);
  //     const { bounds: g } = i;
  //     if (g) {
  //       const e = g.width || 0
  //         , t = g.height || 0
  //         , o = Math.round(e)
  //         , n = Math.round(t)
  //         , i = Math.round(a)
  //         , r = Math.round(s)
  //         , l = r + o
  //         , c = i + n;
  //       g.top = i,
  //         g.left = r,
  //         g.right = l,
  //         g.bottom = c,
  //         g.width = o,
  //         g.height = n
  //     }
  //     return {
  //       bounds: g,
  //       pathValue: this.pathToPathValue(i),
  //       rotatedCompCenter: u
  //     }
  //   }
  // }
  applyInverse = (viewport, pos) => {
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
  immediateApplyPath = () => {
    if (this.path && this.path.segments) {
      // const { onImmediateApplyPath: e } = this.props
      const pathValue = this.pathToPathValue(this.path.clone())
      console.log('pathValue', pathValue)
      const vector = this.pathValueToVector(pathValue)
      console.log('vector', vector)
      return pathValue
      // const t = this.doTransPathToPathValue();
      // this.renderResult(t)
      // if (t && e) {
      //   const { pathValue: o, bounds: n, rotatedCompCenter: i } = t
      //     , { left: a, top: s, right: r, bottom: l, width: c, height: d } = n;
      //   e(o, {
      //     left: a,
      //     top: s,
      //     right: r,
      //     bottom: l,
      //     width: c,
      //     height: d
      //   }, i)
      // }
    }
  }

  // renderResult = (t: any) => {
  //   const { svg } = this
  //   if (!svg.current) return
  //   const { pathValue } = t
  //   // pathValue = [
  //   //   {
  //   //     point: { x: 0, y: 0 }, // 起点
  //   //     handleIn: { x: 0, y: 0 }, // 控制点1
  //   //     handleOut: { x: 0, y: 0 } // 控制点2
  //   //   }
  //   // ],
  //   // const d = pathValue.data.map(({ point: e, handleIn: t, handleOut: o }) => `${e.x},${e.y} ${t.x},${t.y} ${o.x},${o.y}`).join(' ')
  //   // svg.current.innerHTML = ''
  //   // svg.current.appendChild(t.path)
  // }



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
    const { translation: t, scaling: o, rotation: i } = this.matrix
    const gStyle = {
      transform: `translate(${t.x}px, ${t.y}px) scale(${o.x}, ${o.y}) rotate(${i}deg)`,
      shapeRendering: "" + (o.x > .7 ? "auto" : "crispEdges")
    }
    //   , a = {
    //     transform: `translate(${t.x}px, ${t.y}px) scale(${o.x}, ${o.y}) rotate(${i}deg)`,
    //     shapeRendering: "" + (o.x > .7 ? "auto" : "crispEdges")
    //   }
    //   , l = this.path.clone({
    //     insert: false
    //   });
    // if (this.matrix) {
    //   l.matrix = this.matrix.clone().invert();
    // }
    return (
      <div className="svg-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
        <svg version="1.2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <g style={gStyle}>
            <path d={path.pathData} style={pathStyle} />
          </g>
        </svg>
      </div>
    )
    // return n.createElement("div", {
    //   className: "svg-overlay"
    // }, n.createElement("svg", {
    //   version: "1.2",
    //   preserveAspectRatio: "none",
    //   xmlns: "http://www.w3.org/2000/svg"
    // }, n.createElement("g", {
    //   style: a
    // }, n.createElement("path", {
    //   d: l.pathData,
    //   style: e
    // }))))
  }
  render() {
    return (
      <div
        className="pencil-editor-layer"
        onContextMenu={this.handleContextMenu}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* <svg ref={this.svg} width={800} height={800} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></svg> */}

        <canvas ref={this.canvas} width={800} height={800} style={{ opacity: 0 }} />
        {this.renderSVG()}
      </div>
    );
  }
} 
class h extends n.Component {
  constructor(e) {
    super(e),
    this.tolerance = 5,
    this.isCtrl = !1,
    this.isShift = !1,
    this.isAlt = !1,
    this.canvas = n.createRef(),
    this.scaleBy = e => {
      this.matrix.scale(e),
      this.path.matrix.scale(e),
      this.path.strokeWidth *= e
    }
    ,
    this.translateBy = (e, t) => {
      this.matrix.translate(e, t),
      this.path.matrix.translate(e, t)
    }
    ,
    this.handleKeyDown = e => {
      var t, o;
      if (e.preventDefault(),
      e.stopPropagation(),
      !this.path)
        return;
      const {keyCode: n, shiftKey: i, altKey: a} = e
        , s = e.key.toUpperCase();
      if (this.isCtrl = l.isControlKeyPressed(e),
      this.isShift = i,
      this.isAlt = a,
      n === c.default.VK_ESCAPE)
        this.props.onStopEditor();
      else
        d.getLibByShortCutOrType(s) && (this.props.onStopEditor(),
        null === (o = (t = this.props).onStartAddComponentOperationByKeyDown) || void 0 === o || o.call(t, e))
    }
    ,
    this.handleKeyUp = e => {
      e.preventDefault(),
      e.stopPropagation(),
      this.path && (this.isCtrl = !1,
      this.isShift = !1,
      this.isAlt = !1,
      this.forceUpdate())
    }
    ,
    this.onResize = () => {
      this.animateID && window.cancelAnimationFrame(this.animateID),
      this.animateID = window.requestAnimationFrame(( () => {
        if (!this.canvas.current)
          return;
        const {width: e, height: t} = this.canvas.current.getBoundingClientRect();
        i.view.viewSize = new a.Size({
          width: e,
          height: t
        })
      }
      ))
    }
    ,
    this.handleMouseDown = e => {
      e.preventDefault(),
      e.stopPropagation(),
      this.props.onActiveArtboardChange(),
      e.event && 0 !== e.event.button || e.point && (this.path = new a.Path({
        segments: [e.point],
        fullySelected: !0
      }),
      this.props.coreEditor.clearSelected(),
      this.forceUpdate())
    }
    ,
    this.handleMouseDrag = e => {
      e.preventDefault(),
      e.stopPropagation(),
      e.event && 0 !== e.event.button || e.point && this.path && (this.path.add(e.point),
      this.forceUpdate())
    }
    ,
    this.handleMouseUp = e => {
      var t;
      e.preventDefault(),
      e.stopPropagation(),
      e.event && 0 !== e.event.button || e.point && this.path && (((null === (t = this.path.segments) || void 0 === t ? void 0 : t.length) || 0) > 1 && (this.autoColse(),
      this.path.simplify(this.tolerance),
      this.immediateApplyPath()),
      this.path = new a.Path,
      this.forceUpdate())
    }
    ,
    this.handleContextMenu = e => {
      e.preventDefault(),
      e.stopPropagation(),
      this.props.onStopEditor()
    }
    ,
    this.state = {
      matrix: this.props.matrix
    },
    e.onCursorChange(!1, "Pencil")
  }
  componentDidMount() {
    if (!this.canvas.current)
      throw new Error("没有设置画布和窗口元素");
    i.install(this),
    i.setup(this.canvas.current);
    const {width: e, height: t} = this.canvas.current.getBoundingClientRect();
    i.view.viewSize = new a.Size(e,t),
    this.renderPath(),
    i.settings.handleSize = 7,
    i.view.onMouseDown = this.handleMouseDown,
    i.view.onMouseDrag = this.handleMouseDrag,
    i.view.onMouseUp = this.handleMouseUp,
    window.addEventListener("keydown", this.handleKeyDown),
    window.addEventListener("keyup", this.handleKeyUp),
    window.addEventListener("resize", this.onResize),
    this.props.onWorkspaceFocus()
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize),
    window.removeEventListener("keydown", this.handleKeyDown),
    window.removeEventListener("keyup", this.handleKeyUp),
    this.props.onCursorChange(!1, "default"),
    i.view.onMouseDown = i.view.onMouseDrag = i.view.onMouseUp = null
  }
  UNSAFE_componentWillReceiveProps() {
    this.props.onCursorChange(!1, "Pencil")
  }
  get bounds() {
    var e;
    const t = null === (e = this.path) || void 0 === e ? void 0 : e.bounds;
    return {
      left: t.left,
      top: t.top,
      right: t.right,
      bottom: t.bottom,
      width: t.width,
      height: t.height
    }
  }
  renderPath() {
    var e;
    null === (e = this.path) || void 0 === e || e.remove(),
    this.path = new a.Path;
    const {matrix: t} = this.state;
    if (t) {
      const {m11: e, m12: o, m21: n, m22: i, m31: s, m32: r} = t;
      this.matrix = new a.Matrix(e,o,n,i,s,r)
    } else
      this.matrix = new a.Matrix;
    this.path.matrix = this.matrix.clone(),
    this.forceUpdate()
  }
  autoColse() {
    var e, t;
    const o = (null === (t = null === (e = this.path) || void 0 === e ? void 0 : e.segments) || void 0 === t ? void 0 : t.length) || 0;
    if (this.path && o > 2) {
      const {firstSegment: e, lastSegment: t} = this.path;
      e.point.isClose(t.point, 4) && (this.path.closed = !0,
      this.forceUpdate())
    }
  }
  pathToPathValue(e) {
    return {
      closed: !!e.closed,
      data: e.segments.map(( ({point: e, handleOut: t, handleIn: o}) => ({
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
  doTransPathToPathValue() {
    var e, t, o;
    if (this.path) {
      const n = this.path
        , i = n.clone({
        insert: !1
      })
        , {top: a, left: s} = null === (e = i.bounds) || void 0 === e ? void 0 : e.clone()
        , r = n.clone()
        , l = r.bounds
        , c = l.center;
      r.rotate(-this.matrix.rotation, c);
      const d = r.bounds.center;
      r.rotate(this.matrix.rotation, d);
      const h = r.bounds
        , p = {
        x: l.left - h.left,
        y: l.top - h.top
      }
        , u = {
        left: d.x + p.x,
        top: d.y + p.y
      }
        , m = null === (t = this.matrix) || void 0 === t ? void 0 : t.clone().invert();
      i.pivot = null === (o = i.bounds) || void 0 === o ? void 0 : o.topCenter,
      m && (i.matrix = m);
      const {bounds: g} = i;
      if (g) {
        const e = g.width || 0
          , t = g.height || 0
          , o = Math.round(e)
          , n = Math.round(t)
          , i = Math.round(a)
          , r = Math.round(s)
          , l = r + o
          , c = i + n;
        g.top = i,
        g.left = r,
        g.right = l,
        g.bottom = c,
        g.width = o,
        g.height = n
      }
      return {
        bounds: g,
        pathValue: this.pathToPathValue(i),
        rotatedCompCenter: u
      }
    }
  }
  immediateApplyPath() {
    if (this.path && this.path.segments) {
      const {onImmediateApplyPath: e} = this.props
        , t = this.doTransPathToPathValue();
      if (t && e) {
        const {pathValue: o, bounds: n, rotatedCompCenter: i} = t
          , {left: a, top: s, right: r, bottom: l, width: c, height: d} = n;
        e(o, {
          left: a,
          top: s,
          right: r,
          bottom: l,
          width: c,
          height: d
        }, i)
      }
    }
  }
  renderSVG() {
    if (!this.path)
      return;
    let e = {
      strokeWidth: 1,
      stroke: r.parseColorToString(s.DefaultStrokeColor),
      fill: "transparent",
      strokeLinecap: "square"
    };
    const {translation: t, scaling: o, rotation: i} = this.matrix
      , a = {
      transform: `translate(${t.x}px, ${t.y}px) scale(${o.x}, ${o.y}) rotate(${i}deg)`,
      shapeRendering: "" + (o.x > .7 ? "auto" : "crispEdges")
    }
      , l = this.path.clone({
      insert: !1
    });
    return this.matrix && (l.matrix = this.matrix.clone().invert()),
    n.createElement("div", {
      className: "svg-overlay"
    }, n.createElement("svg", {
      version: "1.2",
      preserveAspectRatio: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, n.createElement("g", {
      style: a
    }, n.createElement("path", {
      d: l.pathData,
      style: e
    }))))
  }
  render() {
    return n.createElement("div", {
      className: "pencil-editor-layer",
      onContextMenu: this.handleContextMenu
    }, n.createElement("canvas", {
      ref: this.canvas
    }), this.renderSVG())
  }
}
import React, { CSSProperties, forwardRef, useImperativeHandle } from 'react'

interface EditableProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  onEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
  maxLength?: number;
  autoWidth: boolean | { minWidth?: CSSProperties['minWidth']; maxWidth?: CSSProperties['maxWidth'] }
}

const getStyleFromInput = (input: HTMLElement): CSSProperties => {
  if (!input) {
    return {}
  }
  const computeStyle = window.getComputedStyle(input)
  const cssKeys = [
    'fontSize',
    'fontFamily',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'overflow',
    'tabSize',
    'textIndent',
    'textTransform',
    'whiteSpace',
    'wordBreak',
    'wordSpacing',
    'boxSizing',
    'padding',
    'border'
  ]

  return cssKeys.reduce((t, n) => {
    if (Number.isNaN(Number(n)) && n !== 'length') {
      t[n] = computeStyle[n]
    }
    return t
  }, {})
}

export const Editable: React.FC<EditableProps> = forwardRef(function Editable (props: EditableProps, ref) {
  const {
    className,
    style: propsStyle,
    value,
    maxLength,
    autoWidth: propsAutoWidth = true,
    onSave,
    onCancel,
    onEnd
  } = props
  const inputRef = React.useRef(null)
  const spanRef = React.useRef(null)

  const inComposition = React.useRef(false)
  const lastKeyCode = React.useRef<number>()

  const [current, setCurrent] = React.useState(value)
  const [inputComputeStyle, setInputComputeStyle] = React.useState<CSSProperties>({})

  React.useEffect(() => {
    setCurrent(value)
  }, [value])

  const updateInputWidth = () => {
    const inputEl = inputRef.current
    if (!inputEl) return
    const { width } = spanRef.current.getBoundingClientRect() // need use getBoundingClientRect to get the float width
    inputEl.style.width = `${width}px`
  }

  React.useEffect(() => {
    if (!inputRef.current) return
    const inputEl = inputRef.current
    inputEl.focus()
    inputEl.select()
    if (propsAutoWidth) {
      setInputComputeStyle(getStyleFromInput(inputEl))
      updateInputWidth()
    }
  }, [propsAutoWidth])

  React.useEffect(() => {
    if (propsAutoWidth) {
      const resizeObserver = new ResizeObserver(() => {
        updateInputWidth()
      })
      resizeObserver.observe(spanRef.current)
    }
  }, [propsAutoWidth])

  const onChange = ({ target }) => {
    setCurrent(target.value.replace(/[\n\r]/g, ''))
  }

  const onCompositionStart = () => {
    inComposition.current = true
  }

  const onCompositionEnd = () => {
    inComposition.current = false
  }

  const onKeyDown = ({ keyCode }) => {
    if (inComposition.current) return

    lastKeyCode.current = keyCode
  }

  const confirmChange = () => {
    onSave(current.trim())
  }

  /**
   * 使用useImperativeHandle暴露方法给父组件
   * 通过ref.current.confirmChange()可以手动触发保存，ref.current.onCancel()可以手动触发取消
   */
  // sample code
  // const ParentComponent = () => {
  //   const editableRef = useRef(null);
  //   return (
  //     <>
  //       <Editable ref={editableRef} value="初始文本" onSave={(value) => console.log('保存:', value)} onCancel={() => console.log('取消')} autoWidth={true}/>
  //       <button onClick={() => editableRef.current.confirmChange()}>保存</button>
  //       <button onClick={() => editableRef.current.onCancel()}>取消</button>
  //     </>
  //   );
  // };
  useImperativeHandle(ref, () => ({
    confirmChange,
    cancel: onCancel
  }))

  const onKeyUp = ({
    keyCode,
    ctrlKey,
    altKey,
    metaKey,
    shiftKey
  }) => {
    // Check if it's a real key
    if (
      lastKeyCode.current === keyCode &&
      !inComposition.current &&
      !ctrlKey &&
      !altKey &&
      !metaKey &&
      !shiftKey
    ) {
      if (keyCode === 13) { // Enter
        confirmChange()
        onEnd?.()
      } else if (keyCode === 27) { // ESC
        onCancel()
      }
    }
  }

  const onBlur = () => {
    confirmChange()
  }

  const isObject = (obj: any): obj is Record<string, any> => {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
  }

  const autoWidth = React.useMemo(() => {
    return propsAutoWidth
      ? { minWidth: 0, maxWidth: '100%', ...(isObject(propsAutoWidth) ? propsAutoWidth : {}) }
      : null
  }, [propsAutoWidth])

  const style = {
    minWidth: autoWidth?.minWidth,
    maxWidth: autoWidth?.maxWidth,
    width: autoWidth && 'auto',
    ...propsStyle
  }

  const spanStyle = {
    ...inputComputeStyle,
    ...style,
    whiteSpace: 'nowrap',
    position: 'absolute',
    visibility: 'hidden'
  }

  return (
    <>
      <input
        ref={inputRef}
        className={className}
        maxLength={maxLength}
        value={current}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onBlur={onBlur}
        style={style}
      />
      <span className="auto-width-placeholder" ref={spanRef} style={spanStyle}>{current}</span>
    </>
  )
})
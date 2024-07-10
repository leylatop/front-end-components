import React, { useState, useRef, useEffect, CSSProperties } from 'react';
function Editable() {
  const [inputValue, setInputValue] = useState('');
  const refInputMirror = useRef(null);
  const refInput = useRef(null);

  const [inputComputeStyle, setInputComputeStyle] = useState<CSSProperties>();
  const getStyleFromInput = (input: HTMLElement): CSSProperties => {
    if (!input) {
      return {};
    }
    const computeStyle = window.getComputedStyle(input);
  
    const cssKeys = [
      'font',
      'letterSpacing',
      'overflow',
      'tabSize',
      'textIndent',
      'textTransform',
      'whiteSpace',
      'wordBreak',
      'wordSpacing',
      'paddingLeft',
      'paddingRight',
      'borderLeft',
      'borderRight',
      'boxSizing',
    ];
  
    return cssKeys.reduce((t, n) => {
      t[n] = computeStyle[n];
      return t;
    }, {});
  };
  
  const updateInputWidth = () => {
    if (refInputMirror.current && refInput.current) {
      // const width = refInputMirror.current.clientWidth;
      const {width} = refInputMirror.current.getBoundingClientRect(); // 解决抖动问题，因为clientWidth会四舍五入
      console.log('width', width);

      refInput.current.style.width = `${width}px`;
    }
  };

  useEffect(() => {
    setInputComputeStyle(getStyleFromInput(refInput?.current));
    updateInputWidth();
  }, []);

  useEffect(() => {
    // 监听span的resize事件，更新input的宽度
    const resizeObserver = new ResizeObserver(() => {
      updateInputWidth();
    });
    resizeObserver.observe(refInputMirror.current);
  }, [refInputMirror.current]);
  return (
    <div style={{ position:'relative', width: 'max-content' }}>
      <input
        type="text"
        ref={refInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ minWidth: '20px', maxWidth: `200px`, width: 'auto' }} // 也可以在这里设置最大宽度，以保持一致性
      />
      {/* 隐藏的span用于测量文本宽度 */}
      <span ref={refInputMirror} style={{ 
        // visibility: 'hidden', position: 'absolute', left: 0, top: 0, 
        position: 'absolute',
        minWidth: '20px', maxWidth: `200px`, width: 'auto',...inputComputeStyle }}>
        {inputValue}
      </span>
    </div>
  );
}
export {
  Editable
}
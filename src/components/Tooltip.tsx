import React from "react";
import classNames from 'classnames';

export function isFragment(child: any): boolean {
  return child && React.isValidElement(child) && child.type === React.Fragment;
}


import { Portal } from "./Portal"
export const Tooltip = ({ children, content, placement }) => {
  const child =
    React.isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>;
  // const childProps = child.props;
  // const childCls =
  //   !childProps.className || typeof childProps.className === 'string'
  //     ? classNames(childProps.className, openClassName || `${prefixCls}-open`)
  //     : childProps.className;


  return (
    <>
      {child}
      <Portal className="TOOLTIPS_CONTAINER">
        <TooltipContent content={content} placement={placement}></TooltipContent>
      </Portal>
    </>
  )
}

const TooltipContent = ({ content, placement }) => {
  return (
    <div className={`TOOLTIP TOOLTIP-${placement}`}>
      <div className="arrow">
      </div>
      <div className="content">
        {content}
      </div>
    </div>
  )
}
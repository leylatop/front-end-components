import { Portal } from "./Portal"
export const Tooltip = ({ children, content, placement }) => {
  return (
    <>
      <Portal className="TOOLTIPS_CONTAINER">
        <TooltipContent content={content} placement={placement}></TooltipContent>
      </Portal>
      {children}
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
import { Tooltip } from "../components/Tooltip"

export const TooltipContainer = () => {
  return (
    <div>
      <Tooltip content={'-----------'} placement>
        <button onClick={() => {console.log('click')}}>Tooltip</button>
      </Tooltip>
    </div>
  )
}
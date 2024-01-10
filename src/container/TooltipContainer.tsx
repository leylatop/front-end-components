import { Title } from "../components/Title"
import { Tooltip } from "../components/Tooltip"

export const TooltipContainer = () => {
  return (
    <div>
      <Title>TooltipContainer</Title>
      <Tooltip>
        <button onClick={() => {console.log('click')}}>Tooltip</button>
      </Tooltip>
    </div>
  )
}
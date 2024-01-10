
const LEVEL_MAP = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6'
}

export type TitleLevel = keyof typeof LEVEL_MAP
export type TitleProps = {
  children: React.ReactNode
  level?: TitleLevel
}
export const Title = ({ children, level = 'h1'}) => {
  const Tag = LEVEL_MAP[level] || 'h1'
  return (
    <div>
      <Tag>{children}</Tag>
    </div>
  )
}
export type ContentType = 'image_url' | 'text'

export type MessageContent = {
  type: ContentType,
  image_url?: {
    type: 'image_url',
    detail: string,
    url: string
  },
  text?: string
} [] | string

export type Message = {
  role: string,
  content: MessageContent
}
import { IMAGE_URL_TYPE, SYSTEM_ROLE, TEXT_TYPE, USER_ROLE } from "./constants"
import { ContentType, Message, MessageContent } from "./type"
import { prompt } from "./constants"

export const getImageContent = (imgSrc: string): MessageContent => {
  return {
    type: IMAGE_URL_TYPE,
    [IMAGE_URL_TYPE]: { detail: "auto", url: imgSrc },
  }
}

export const getTextContent = (text: string): MessageContent => {
  return {
    type: TEXT_TYPE,
    [TEXT_TYPE]: text
  }
}

export const getUserMessage = (content: MessageContent): Message => {
  return {
    role: USER_ROLE,
    content: content
  }
}

export const getSystemMessage = () => {
  return {
    role: SYSTEM_ROLE,
    content: prompt
  }
}

export const handleAssistantMessage = (message: Message): ContentType => {
  if(!message) return ''
  const { content } = message
  // 截取content字符串中```html```中间的内容
  const htmlContent = content.match(/```html([\s\S]*)```/)?.[1]
  // 截取content字符串中```css```中间的内容
  const cssContent = content.match(/```css([\s\S]*)```/)?.[1]
  // 截取content字符串中```js```中间的内容
  const jsContent = content.match(/```js([\s\S]*)```/)?.[1]
  // 截取content字符串中```md```中间的内容
  return htmlContent
}

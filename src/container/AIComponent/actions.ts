import { MessageAction } from "./reducer"
import { getMessages, getMessagesAssistant } from "./selector"
import { requestOpenAIAzure } from "../../utils/request"
import { getSystemMessage } from "./util"
import { LOADING_MESSAGE, apiKey, url } from "./constants"
import { Message } from "./type"
import Saver from "../../utils/saver"

const SAVER_ID = '19950428'
export const initMessages = () => {
  return async (dispatch, getState) => {
    const saverInstance = new Saver(SAVER_ID)
    const store = window.store
    const saver = await saverInstance.getSaved()
    saverInstance.startSaving(store, 'messages')
    saverInstance.startSaving(store, 'assistantMessages')
    const { messages = [], assistantMessages = [] } = saver || {}
    dispatch({ type: MessageAction.UpdateMessages, payload: messages })
    dispatch({ type: MessageAction.UpdateAssistantMessages, payload: assistantMessages })
  }
}

// 发送消息
export const reportMessage = (message: Message) => {
  return async (dispatch, getState) => {
    const state = getState()
    const messages = getMessages(state)
    const assistantMessages = getMessagesAssistant(state)
    dispatch(renderLoadingMessage(message))
    try {
      let postMessage
      if(messages.length === 0) {
        postMessage = [getSystemMessage(), message]
      } else {
        postMessage = [...messages, message]
      }
      const data = await requestOpenAIAzure({ url, apiKey, messages: postMessage })
      const { message: replayMessageItem } = data.choices[0]
      dispatch({ type: MessageAction.UpdateAssistantMessages, payload: [...assistantMessages, replayMessageItem]})
      dispatch(removeRenderLoadingMessage(replayMessageItem))
    } catch (error) {
      console.log('error', error)
      dispatch(removeRenderLoadingMessage(message))
    }
  }
}


const renderLoadingMessage = (message: Message) => {
  return (dispatch, getState) => {
    const state = getState()
    const messages = getMessages(state)
    if(messages.length === 0) {
      const systemMessage = getSystemMessage()
      dispatch({ type: MessageAction.UpdateMessages, payload: [systemMessage, message, LOADING_MESSAGE ] })
    } else {
      dispatch({ type: MessageAction.UpdateMessages, payload: [...messages, message, LOADING_MESSAGE ] })
    }
  }
}

const removeRenderLoadingMessage = (message: Message) => {
  return (dispatch, getState) => {
    const state = getState()
    const messages = getMessages(state)
    const updateMessages = [...messages]
    updateMessages.pop()
    dispatch({ type: MessageAction.UpdateMessages, payload: [...updateMessages, message ] })
  }
}

export const clearMessages = () => {
  return (dispatch, getState) => {
    const MESSAGE_KEY = 'message' + new Date().toLocaleDateString()
    localStorage.removeItem(MESSAGE_KEY)
    dispatch({ type: MessageAction.UpdateMessages, payload: [] })
    
  }
}




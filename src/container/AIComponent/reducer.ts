const initialState = {
  messages: [],
  assistantMessages: [],
}

export const MessageAction = {
  UpdateMessages: 'reducer:message:update:messages',
  UpdateAssistantMessages: 'reducer:message:update:assistantMessages',
}

function messagesReducer (state = initialState, { type, payload }) {
  switch (type) {
    case MessageAction.UpdateMessages:
      return { ...state, messages: payload }
    case MessageAction.UpdateAssistantMessages:
      return { ...state, assistantMessages: payload }
    default:
      return { ...state }
  }
}

export default messagesReducer


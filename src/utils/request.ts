
export const requestOpenAIAzure = async ({ url='', messages = [], apiKey='' }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      "messages":    messages, // 对话信息
      "max_tokens":  2048,     // 生成答案的最大令牌数
      "temperature": 0.7,
      "top_p":       1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    })
  })
  const json = await response.json()
  return json
}
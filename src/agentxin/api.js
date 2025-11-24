import request from '@/utils/request.js'

export function GetThread(params) {
  return request.post('/agentapi/ai/threads', {
    'thread_id': '',
    'if_exists': 'raise'
  }, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.apiKey}`
    }
  })
}

export function GetData(params) {
  return request.post(`/agentapi/ai/threads/${params.thread_id}/runs/${params.runKey||'wait'}`, {
      'assistant_id': params.assistantId,
      input: params
  }, {
      timeout: 60*60*1000,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${params.apiKey}`
      }
  })
}
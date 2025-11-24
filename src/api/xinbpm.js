import request from '@/utils/request.js'

export function GetDoneData(params) {
  return request.post('/api/ab-bpm/boot/home/pendingList', params, {
    headers: {
    }
  })
}

export function GetFinishData(params) {
    return request.post('/api/ab-bpm/boot/home/doneList', params, {
      headers: {
      }
    })
}

export function GetUnreadData(params) {
    return request.post('/api/ab-bpm/boot/home/viewUnreadList', params, {
      headers: {
      }
    })
}

export function GetReadData(params) {
    return request.post('/api/ab-bpm/boot/home/viewReadList', params, {
      headers: {
      }
    })
}

export function ReadData(params) {
  return request.post('/systest/sys/notify/sys_notify_todo/sysNotifyTodo.do?method=deleteall', {
    List_Selected: params.id
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;'
    }
  });
}

// 待阅置为已阅 BPM
export function BPMReadData(params) {
  const { id } = params
  return request.get(`/api/ab-bpm/bpm/carbonCopy/updateRead?id=${id}`);
}


export function GetMyData(params) {
  return request.post('/api/ab-bpm/boot/home/initiateList', params, {
    headers: {
    }
  })
}

export function GetFeiyongDataById(params) {
  const { id } = params
  return request.get(`/api/ab-bpm/sysNotifyTodo/message/getTodo/${id}`);
}
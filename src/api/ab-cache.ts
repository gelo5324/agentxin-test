// 存储数据的内存缓存对象
let memoryCache: any

// 清除内存中的数据
function clearMemory(code: any) {
  if (memoryCache[code]) delete memoryCache[code].data
}

// 从内存中获取数据，如果过期或者不存在，返回null
function getFromMemory(code: any) {
  const cacheData = memoryCache[code]
  if (
    cacheData &&
    cacheData.expireTime &&
    Date.now() < cacheData.expireTime &&
    cacheData.data
  ) {
    return cacheData.data
  } else {
    clearMemory(code)
    return null
  }
}

// 将数据存储到内存中，设置有效期 60s
function setToMemory(code: any, data: any) {
  const expireTime = Date.now() + 60 * 1000
  memoryCache[code] = { data, expireTime }
}

/**
 * 获取数据
 * 如果内存中不存在或过期了，从后台获取
 * 这里考虑到并发问题，只有当前没有请求时才发起请求
 * 此时有其他请求在发起，等待上一个请求的结果
 *
 * @param code 缓存code
 * @param getDataFn  从后台获取数据的方法
 * @returns
 */
export async function getCacheData(code: any, getDataFn: Function) {
  if (!(window as any).memoryCache) {
    ;(window as any).memoryCache = {}
  }
  memoryCache = (window as any).memoryCache

  let data = getFromMemory(code)
  if (data) {
    return data
  }

  if (!memoryCache[code] || !memoryCache[code].pending) {
    if (!memoryCache[code]) memoryCache[code] = {}
    memoryCache[code].pending = true
    try {
      data = await getDataFn()
      if (data) {
        setToMemory(code, data)
      }
    } finally {
      delete memoryCache[code].pending
    }
  } else {
    data = await eachGetFormCache(code)
  }
  return data
}

async function eachGetFormCache(code: any) {
  for (let index = 0; index < 100; index++) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const data = getFromMemory(code)
    if (data != null) {
      return data
    }
  }

  console.error('查找失败！！！')
}

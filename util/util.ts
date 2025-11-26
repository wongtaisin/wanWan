/**
 * @desc 深拷贝
 * @param {any} data - 要拷贝的数据
 * @returns {any} 拷贝后的数据
 */
const deepClone = <T>(data: T): T => {
  if (typeof data !== 'object' || data === null) return data
  return JSON.parse(JSON.stringify(data))
}

/**
 * 根据时间戳和格式返回格式化的日期字符串
 * @param {number} timestamp - 时间戳
 * @param {string} format - 日期格式
 * @returns {string} 格式化后的日期字符串
 * @example
 * @demo formatDate(1507513800642, 'yyyy/MM/dd hh:mm:ss') => '2017/10/09 09:50:00'
 * @demo formatDate(1507513800642, 'yyyy-MM-dd hh:mm:ss') => '2017-10-09 09:50:00'
 * @demo formatDate(1507513800642, 'yyyy.MM.dd , hh-mm-ss') => '2017.10.09 , 09-50-00'
 */
const formatDate = (timestamp: number, format: string): string => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return ''

  const timeUnits: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }

  format = format.replace(/(y+)/g, match => (date.getFullYear() + '').slice(-match.length))

  Object.entries(timeUnits).forEach(([key, value]) => {
    format = format.replace(new RegExp(`(${key})`), match =>
      match.length === 1 ? String(value) : ('00' + value).slice(-match.length)
    )
  })

  return format
}

/**
 * @desc 将对象转换为URL查询字符串
 * @param {Record<string, any>} params - 要转换的参数对象
 * @returns {string} 转换后的URL查询字符串
 */
const urlJsonList = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([_, value]) => value != null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

/**
 * @desc 验证手机号码
 * @param {string | number} value - 要验证的电话号码
 * @returns {Promise<void>} 验证结果
 */
const isMobileNumber = (value: string | number): Promise<void> => {
  if (!value) {
    return Promise.reject(new Error('请输入电话号码'))
  }

  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(String(value))
    ? Promise.resolve()
    : Promise.reject(new Error('手机号码格式如:138xxxx8754'))
}

/**
 * @desc 计算数组中指定属性的数值总和
 * @param {string} property - 属性名
 * @param {any[]} arr - 数据数组
 * @param {number} to - 小数位数,默认0
 * @returns {string} 总和(整数字符串)
 */
const getAllNumber = (property: string, arr: any[], to: number = 0): string => {
  const amount = arr.reduce((sum: any, item: any) => {
    const value = parseFloat(item[property])
    if (value < 0) {
      return sum - Math.abs(value)
    } else {
      return sum + value
    }
  }, 0)
  return amount > 0 ? Number(amount).toFixed(to) : amount < 0 ? Number(amount).toFixed(to) : '0'
}

/**
 * @desc 获取当前月份的日期列表
 * @param {string} yearMonth - 年月字符串
 * @returns {any[]} 日期列表
 */
const monthDates = (yearMonth: string) => {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  if (!yearMonth) return []

  const [yearStr, monthStr] = yearMonth.split('年')
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)
  if (isNaN(year) || isNaN(month)) return []

  const daysInMonth = new Date(year, month, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month - 1, index + 1)
    return {
      date: index + 1,
      weekDay: weekDays[date.getDay()]
    }
  })
}

/**
 * @desc 计算时间差异
 * @param {string} startTime - 开始时间
 * @param {string} endTime - 结束时间
 * @returns {Record<string, number>} 时间差异对象
 */
const timeDifference = (startTime: string, endTime: string) => {
  // 将时间字符串转换为Date对象
  const start = new Date(startTime)
  const end = new Date(endTime)

  // 计算时间差异（以毫秒为单位）
  const difference = end.getTime() - start.getTime()

  // 将时间差异转换为天、小时、分钟和秒
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 构造树型结构数据
 * @param {any[]} data 数据源
 * @param {string} id id字段 默认 'id'
 * @param {string} parentId 父节点字段 默认 'parentId'
 * @param {string} children 孩子节点字段 默认 'children'
 */
const handleTree = (data: any[], id?: string, parentId?: string, children?: string) => {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  var childrenListMap: any = {}
  var nodeIds: any = {}
  var tree = []

  for (let d of data) {
    let parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (let d of data) {
    let parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  const adaptToChildrenList = (o: any) => {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t)
  }

  return tree
}

/**
 * @desc 获取指定天数前的日期字符串
 * @param {number} days - 天数,默认0
 * @returns {string} 格式化后的日期字符串 2025-08-14
 * @example 假设今天是 2025-08-14
 * @demo selectedDate(0) => '2025-08-14'
 * @demo selectedDate(1) => '2025-08-13'
 * @demo selectedDate(30) => '2025-07-15'
 */
const selectedDate = (days: number = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * @desc 格式化数字，去除多余的零
 * @param {number} num - 要格式化的数字
 * @param {number} to - 小数位数,默认2
 *
 * @returns {string} 格式化后的数字字符串
 * @example 假设 num = 123.456
 * @demo formatNumber(123.456) => 123.46
 * @demo formatNumber(123.456, 2) => 123.46
 * @demo formatNumber(123.456, 1) => 123.5
 * @demo formatNumber(123.456, 0) => 123
 */
const formatNumber = (num: number, to: number = 2) => {
  const sum = num
    .toFixed(to) // 保留 to 位小数
    .replace(/\.?0+$/, '') // 移除末尾的零

  return Number(sum)
}

/**
 * @desc 获取客户端IP地址
 * @param {Request} req - 请求对象
 *
 * @returns {string} 客户端IP地址
 */
const getClientIp = (req: any) => {
  // 1. 尝试从 X-Forwarded-For 拿真实 IP
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    // X-Forwarded-For 可能是 "真实IP, 代理IP, 代理IP"
    return forwarded.split(',')[0].trim()
  }

  // 2. Express 自带的 req.ip 在 trust proxy 开启后会自动识别
  if (req.ip) {
    return req.ip
  }

  // 3. Node 原生字段（通常不是真实IP）
  const remote = req.connection?.remoteAddress || req.socket?.remoteAddress
  return remote || null
}

export default {
  deepClone,
  formatDate,
  urlJsonList,
  isMobileNumber,
  getAllNumber,
  monthDates,
  timeDifference,
  handleTree,
  selectedDate,
  formatNumber,
  getClientIp
}

// 获取登录时间的函数
export const getTime = () => {
  let msg = ''
  let hours = new Date().getHours()
  if (hours >= 6 && hours < 12) {
    msg = '早上'
  } else if (hours >= 12 && hours < 18) {
    msg = '下午'
  } else {
    msg = '晚上'
  }
  return msg
}

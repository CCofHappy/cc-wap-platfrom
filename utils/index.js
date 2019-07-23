import Cookie from 'js-cookie'

export const setToken = token => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token)
  Cookie.set('token', token)
}

export const unsetToken = () => {
  if (process.server) return
  window.localStorage.removeItem('token')
  Cookie.remove('token')
}
// 获取服务器端cookie
export const getUserFromCookie = req => {
  if (!req.headers.cookie) return
  if (req.headers.cookie.includes('token=')) {
    const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('token='))
    const token = jwtCookie.split('=')[1]
    return token
  }else {
    return null
  }
}

export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

// 获取客户端cookie
export const getcookiesInClient = key => {
  return Cookie.get(key) ? Cookie.get(key) : ''
}

//格式化日期
export const format = (param, d) => {
  let parseDate = (date) => {
    let temp;
    if (date === null) return new Date(NaN);
    if (date === void 0) return new Date();
    if (typeof data === 'string' && (temp = date.match(this.timeReg))) {
      return new Date(
        temp[1], temp[2] - 1, temp[3] || 1,
        temp[5] || 0, temp[6] || 0, temp[7] || 0, temp[8] || 0
      )
    };
    return new Date(date)
  }
  let timeInit =  (d) => {
    let t = parseDate(d);
    return {
      Y: t.getFullYear(),
      M: t.getMonth(),
      D: t.getDate(),
      W: t.getDay(),
      H: t.getHours(),
      m: t.getMinutes(),
      s: t.getSeconds(),
      ms: t.getMilliseconds()
    };
  };
  const str = param || 'YYYY-MM-DD HH:mm:ss';
  const T = timeInit(d);
  const regf = /\[.*?\]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SSS/g
  return str.replace(regf, (match) => {
    switch (match) {
      case 'YY':
        return String(T.Y).slice(-2)
      case 'YYYY':
        return String(T.Y)
      case 'M':
        return String(T.M + 1)
      case 'MM':
        return T.M < 9 ? 0 + String(T.M + 1) : String(T.M + 1)
      case 'D':
        return String(T.D)
      case 'DD':
        return T.D < 10 ? 0 + String(T.D) : String(T.D)
      case 'H':
        return String(T.H)
      case 'HH':
        return T.H < 10 ? 0 + String(T.H) : String(T.H)
      case 'm':
        return String(T.m)
      case 'mm':
        return T.m < 10 ? 0 + String(T.m) : String(T.m)
      case 's':
        return String(T.s)
      case 'ss':
        return T.s < 10 ? 0 + String(T.s) : String(T.s)
      case 'SSS':
        return T.ms < 100 ? 0 + String(T.ms) : String(T.ms)
    }
  })
}

// 乘法防丢失
//乘法
export const accMul = (arg1, arg2, arg3) => {//乘法防丢失
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString(), s3 = arg3.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  try { m += s3.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) * Number(s3.replace(".", "")) / Math.pow(10, m)
}

export function nanoid(size = 10) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    crypto.getRandomValues(new Uint8Array(size)).forEach(n => {
      id += chars[n % chars.length]
    })
    return id
  }
  
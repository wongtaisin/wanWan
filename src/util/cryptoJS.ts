import CryptoJS from 'crypto-js'

/**
 * @desc 加密的值会不断的变化，需要解密后才能比较是否相等
 * @param {string} str 待解密的字符串
 * @returns {object} 加密后的字符串和解密后的字符串
 */
export const decrypt = (str: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8) // 128位盐值
  // 加密
  const encrypt = CryptoJS.AES.encrypt(str, 'wongtaisin').toString()

  // 解密
  const bytes = CryptoJS.AES.decrypt(encrypt, 'wongtaisin')
  const original = bytes.toString(CryptoJS.enc.Utf8) // "hello"

  return {
    encrypt,
    original,
    salt
  }
}

/**
 * @desc 哈希密码
 * @param {string} password 密码
 * @returns {object} 哈希值和盐值
 */
export const hashPassword = (password: string) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8) // 128位盐值
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256位哈希值
    iterations: 10000 // 迭代次数
  })

  return {
    hash: hash.toString(),
    salt: salt.toString()
  }
}

/**
 * @desc 验证密码
 * @param {string} password 密码
 * @param {string} storedHash 存储的哈希值
 * @param {string} storedSalt 存储的盐值
 * @returns {boolean} 是否验证通过
 */
export const verifyPassword = (password: string, storedHash: string, storedSalt: string) => {
  const hash = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(storedSalt), {
    keySize: 256 / 32,
    iterations: 10000
  })

  return hash.toString() === storedHash
}

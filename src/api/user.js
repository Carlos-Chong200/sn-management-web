import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/user/userInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout(accessToken) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: {
      accessToken,
    },
  })
}

export function register(param) {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      ...param,
    },
  })
}

import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/maintenance/getList',
    method: 'post',
    data,
  })
}

export function doCreate(data) {
  return request({
    url: '/maintenance/doCreate',
    method: 'post',
    data,
  })
}
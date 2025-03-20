import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/deviceManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/deviceManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doUpdate(data) {
  return request({
    url: '/deviceManagement/doUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/deviceManagement/doDelete',
    method: 'post',
    data
  })
}

export function doGenerate(data) {
  return request({
    url: '/deviceManagement/generate',
    method: 'post',
    data,
  })
}

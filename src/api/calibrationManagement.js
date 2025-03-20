import request from '@/utils/request'

export function getLastRecord(data) {
  return request({
    url: '/calibrationManagement/lastRecord',
    method: 'post',
    data,
  })
}

export function addRecord(data) {
  return request({
    url: '/calibrationManagement/add',
    method: 'post',
    data,
  })
}

export function getRecordList(data) {
  return request({
    url: '/calibrationManagement/search',
    method: 'post',
    data,
  })
}
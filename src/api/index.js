import request from '@/utils/request'

/**
 * 文件上传
 * @param {object} data
 * @param {binary} data.file
 * @param {function} onUploadProgress
 * @returns {Promise<string>} file id
 * @param {String} uploadType NORMAL_UPLOAD("正常上传"),ANNEX("附件上传")
 */
export function uploadFile(data, onUploadProgress, params) {
  return request({
    url: '/api/v1/file/uploadFile',
    method: 'post',
    params,
    data,
    onUploadProgress,
  })
}

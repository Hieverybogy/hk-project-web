import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { getToken } from "../sign";

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType, ...rest } = option
  const token = getToken()

  return service.request({
    url: url,
    method,
    params,
    data:
      headers?.['Content-Type'] === 'multipart/form-data'
        ? data
        : Object.assign({ showLoading: true }, data),
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      'Authorization': token ?? '',
      ...headers
    },
    ...rest
  })
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}

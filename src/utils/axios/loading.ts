import { ElLoading } from 'element-plus'

let loadingInstance: any = null
let loadingCount = 0

export const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      fullscreen: true,
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    })
  }
  loadingCount++
}
export const hideLoading = () => {
  loadingCount--
  if (loadingCount === 0) {
    loadingInstance.close()
  }
}

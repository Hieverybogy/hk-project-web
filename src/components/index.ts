import type { App } from 'vue'
import { Upload } from './Upload'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('UnnUpload', Upload)
}

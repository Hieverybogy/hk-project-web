<template>
  <el-upload
    v-model:file-list="fileList"
    action="#"
    list-type="picture-card"
    :auto-upload="false"
    :multiple="true"
    :disabled="disabled"
    :accept="accept"
    :on-change="handleChange"
  >
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" @error="imgError($event)" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <el-icon><Download /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, watch, unref, computed } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile, UploadProps, UploadUserFile } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import useGlobelProperties from '@/hooks/web/useGlobelProperties'
import request from '@/utils/axios'
import service from '@/utils/axios/service'

import errorPic from '@/assets/images/pic_404.png'
const UPLOAD_SERVER = ''


// 全局context
const _this = useGlobelProperties()

const emit = defineEmits(['update:modelValue', 'change', 'delete'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  disabled: Boolean, //是否只读
  size: [Number, String], //文件上传最大值
  count: [Number, String], //文件上传数量
  type: String, //允许上传的文件类型，这个是文件选择之后需要校验的内容
  url: String, //上传路径
  accept: {
    //接收的文件类型，注意这个跟type是有区别的，这个只是在选择时，自定义的选择类型
    type: String,
    default: null
  },
  // 文件字段映射
  propsMap: {
    type: Object,
    default: () => {
      return {
        // 文件名
        fileName: 'name',
        // 文件大小
        size: 'size',
        // 文件后缀
        extension: 'extension',
        // 上传名称
        date: 'uploadDate',
        // 上传人
        uploader: 'uploader',
        // 上传人ID
        uploaderId: 'uploaderId',
        // 文件路径
        url: 'filePath',
        // 文件id
        id: 'id',
        cloudFileId: 'cloudFileId',
        // 缩略图
        thumbnailSmallPath: 'thumbnailSmallPath'
      }
    }
  }
})

const fileList = ref<UploadUserFile[]>([])
watch(
  () => props.modelValue,
  (val) => {
    fileList.value = cloneDeep(val as UploadUserFile[])
  },
  { deep: true, immediate: true }
)

const imgError = (e) => {
  e.target.src = errorPic
}

// 预览
const handlePictureCardPreview = (file: UploadFile) => {
  const index = fileList.value.findIndex((k) => k.url === file.url)
  // createImageViewer({
  //   initialIndex: index,
  //   urlList: fileList.value.map((k) => k.url)
  // })
}

// 下载
const handleDownload = (file: UploadFile) => {
  // console.log('downloadFile', file)
  window.open(file.url)
}

// 删除
const handleRemove = (file: UploadFile) => {
  // console.log('deleteFile', file)
  const index = fileList.value.findIndex((k) => k.url === file.url)
  fileList.value.splice(index, 1)
  emit('update:modelValue', unref(fileList))
  emit('delete', file, unref(fileList))
}

const fileSize = computed(() => {
  return Number(props.size || 0) * 1024
})

const getItem = (item) => {
  var list = props.modelValue as any[]
  if (list.length === 0) {
    return {}
  }
  var sameFile = (item.name || '').trim()

  //根据后台返回的数据size+name,来判断是否同一个名称
  var hasFileSize = false

  if (list[0].FileSize > 0) {
    hasFileSize = true
    sameFile += item.size
  }

  var returnObj = {}

  for (var i = 0, ii = list.length; i < ii; i++) {
    var obj = list[i]
    var fileStr = hasFileSize
      ? obj[props.propsMap.fileName] + (obj[props.propsMap.extension] || '').trim() + obj[props.propsMap.size]
      : obj[props.propsMap.fileName] + (obj[props.propsMap.extension] || '').trim()
    if (fileStr === sameFile) {
      returnObj = {
        item: obj,
        index: i
      }
      break
    }
  }

  return returnObj
}

let timeout: any = null
const handleChange: UploadProps['onChange'] = (file, uploadFiles) => {
  console.log('changeFile', file, uploadFiles)

  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const datas = props.modelValue
    const myFileList = uploadFiles.slice(datas.length, uploadFiles.length)

    // 检查数量
    if (props.count && !isNaN(Number(props.count))) {
      if (Number(props.count) < uploadFiles.length) {
        _this.$message.error(`上传数量不能超过${rops.count}个`)
        uploadFiles.splice(datas.length, uploadFiles.length)
        return false
      }
    }

    //检查格式
    if (props.type) {
      var types = props.type.split(',').join('$|') + '$'
      var reg = new RegExp(types, 'ig')

      for (var j = 0, jj = myFileList.length; j < jj; j++) {
        var myfile = myFileList[j]
        if (myfile.name.search(reg) === -1) {
          uploadFiles.splice(datas.length, uploadFiles.length)
          let fileType: any = myfile.name.split('.')
          fileType = fileType[fileType.length - 1]
          _this.$message.error(`不能上传${fileType}格式的文件`)
          return false
        }
      }
    }

    // 检查容量大小
    if (fileSize.value) {
      let sizes = 0
      for (let j = 0, jj = myFileList.length; j < jj; j++) {
        const myfile = myFileList[j]
        if (myfile.size === 0) {
          uploadFiles.splice(datas.length, uploadFiles.length)
          _this.$message.error('不能上传空文件')
          return false
        } else if (fileSize.value < (myfile.size as number)) {
          uploadFiles.splice(datas.length, uploadFiles.length)
          const mSize = fileSize.value / 1024
          let size = mSize + 'KB'
          if (mSize > 1024) {
            size = (mSize / 1024).toFixed(2) + 'M'
          }
          _this.$message.error(`不能上传大于${size}的文件`)
          return false
        }

        sizes += myfile.size as number
      }
      if (fileSize.value < sizes) {
        const mSize = fileSize.value / 1024
        let size = mSize + 'KB'
        if (mSize > 1024) {
          size = (mSize / 1024).toFixed(2) + 'M'
        }
        _this.$message.error(`不能上传大于${size}的文件`)
        uploadFiles.splice(datas.length, uploadFiles.length)
        return false
      }
    } else {
      // 没有大小限制时也要校验是否为空文件
      for (let j = 0, jj = myFileList.length; j < jj; j++) {
        const myfile = myFileList[j]
        if (myfile.size === 0) {
          uploadFiles.splice(datas.length, uploadFiles.length)
          _this.$message.error('不能上传空文件')
          return false
        }
      }
    }

    // 检查文件是否相同
    for (let i = 0, ii = myFileList.length; i < ii; i++) {
      const data = myFileList[i]
      const fileData = getItem(data)
      if (fileData?.item) {
        uploadFiles.splice(datas.length, uploadFiles.length)
        _this.$message.error('不能上传已存在文件')
        return false
      }
    }

    // 上传接口
    emit('update:modelValue', uploadFiles)
    emit('change', file, uploadFiles)
    upload(file, uploadFiles)
  })
}

// 上传接口
const upload = (file, uploadFiles) => {
  const fileData = uploadFiles.slice((props.modelValue || []).length)
  
  let url = props.url
  if (!url) {
    url = '/aaa/upload'
  }
  if (url?.indexOf('http:') === -1 && UPLOAD_SERVER) {
    url = UPLOAD_SERVER + url
  }
  var formdata = new FormData()
  fileData.forEach(function (item, i) {
    formdata.append('file', item.raw)
  })

  service.request({
    method: "post",
    url: url,
    data: formdata,
    timeout: +20000,
    // headers: {
    //     "Content-Type": "multipart/form-data"
    // },
  }).then((res) => {
    emit('update:modelValue', uploadFiles)
    emit('change', file, uploadFiles)
  })

  // request
  //   .post({
  //     url,
  //     data: formdata,
  //     timeout: +20000,
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  //   .then((res) => {
  //     emit('update:modelValue', uploadFiles)
  //     emit('change', file, uploadFiles)
  //   })
}
</script>

<style scoped></style>

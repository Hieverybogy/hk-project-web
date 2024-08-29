import { reactive, toRefs, h, unref, ref, nextTick } from 'vue'
import type { VNode } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import useGlobelProperties from '@/hooks/web/useGlobelProperties'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTable, ElTooltip } from 'element-plus'

export type PagerParmas<T = any> = {
  pageNum: number
  pageSize: number
  filter?: T
}

interface Pager<T, F> {
  dataList: T[]
  params: F | any
  fetchDataApi: Function | null
  loading: boolean
  pagerParams: PagerParmas<F>
  pageTotal: number
  pageArr: number[]
  pageFunc: Function | null
  layout: string
  maxBodyHeight: number | string
  sumProps: Array<any>
  multipleSelection: T[]
}

// 合计
interface SummaryMethodProps<T> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const useList = <T = any, F = any>() => {
  const _this = useGlobelProperties()
  const { t } = useI18n()

  const state: Pager<T, F> = reactive({
    // 表格数据
    dataList: [],
    params: {},
    // 接口
    fetchDataApi: null,
    loading: false,
    // 页脚分页
    pagerParams: {
      pageNum: 1, // 当前页
      pageSize: 10 // 每页显示条数
    },
    pageTotal: 0,
    pageArr: [10, 20, 40, 60, 100],
    pageFunc: null,
    layout: 'total, sizes, next, pager, prev, jumper',
    maxBodyHeight: 0, // 不规范，为了动态响应
    // 合计
    sumProps: [],
    // 多选
    multipleSelection: []
  })

  // dom
  const tableRef = ref<InstanceType<typeof ElTable>>()

  /**
   * 获取表单数据
   */
  const getApiList = async (
    params = {
      ...unref(state.params),
      ...unref(state.pagerParams)
    },
    successFn,
    endFn
  ) => {
    state.loading = true
    try {
      const res = typeof state.fetchDataApi === 'function' ? await state.fetchDataApi(params) : null
      console.log('fetchDataApi res', res)
      if (res) {
        state.dataList = res.data.list
        state.pageTotal = res.data.total || 0
        typeof successFn === 'function' && successFn()
      }
    } catch (err) {
      console.log('fetchDataApi error')
    } finally {
      state.loading = false
      typeof endFn === 'function' && endFn()
    }
  }
  state.pageFunc = getApiList

  /**
   * 分页
   */
  const pageSizeChange = (val) => {
    const params = state.pagerParams
    params.pageSize = val
    if (params.pageNum !== 1) {
      params.pageNum = 1
    }
    if (typeof state.pageFunc === 'function') {
      state.pageFunc()
    }
  }

  /**
   * 分页
   */
  const pageCurrentChange = (val) => {
    const params = state.pagerParams

    params.pageNum = val
    if (typeof state.pageFunc === 'function') {
      state.pageFunc()
    }
  }

  /**
   * 合计
   */
  const getSummaries = (param: SummaryMethodProps<T>) => {
    /*     const { columns, data } = param
    const sums: (string | VNode)[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: 'underline', color: 'red' } }, [
          t('common.subtotal')
        ])
        return
      }

      if (state.sumProps.includes(column.property)) {
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `${values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!Number.isNaN(value)) {
              return _this.$utils.formatNumber(prev + curr)
            } else {
              return _this.$utils.formatNumber(prev)
            }
          }, 0)}`
        } else {
          sums[index] = 'N/A'
        }
      }
    })

    const totalSums = sums.slice() // 复制一份作为合计行
    totalSums[0] = '合计'
    return sums */

    const { columns, data } = param
    const sums: (string | VNode)[] = []
    // 保留换行符    选中合计行的每一个元素，然后给每一个元素都添加css样式whiteSpace。
    nextTick(() => {
      tableRef.value?.$el.querySelector('.el-table__footer-wrapper').classList.add('el-table__sum')
    })

    // 以下是对小计和总计分别进行赋值
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: { textDecoration: 'underline' } }, [
          h('div', { style: { padding: '8px 0' } }, t('common.subtotal')),
          h('div', { style: { padding: '8px 0' } }, t('common.total'))
        ])
        return
      }
      if (state.sumProps.includes(column.property)) {
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => Number.isNaN(value))) {
          sums[index] = `${values.reduce((prev, curr, i) => {
            let val = 0
            if (!Number.isNaN(Number(curr))) {
              val = prev + curr
            } else {
              val = prev
            }
            if (i === values.length - 1) {
              return _this.$utils.formatNumber(val)
            }
            return val
          }, 0)}`
        } else {
          sums[index] = 'N/A'
        }

        const makeTip = (content) => {
          const nr = h(
            'div',
            {
              title: sums[index],
              style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                margin: '8px 0 0',
                padding: '0 0 8px'
              }
            },
            content
          )
          return nr
          // return h(
          //   ElTooltip,
          //   {
          //     effect: 'dark',
          //     content: content,
          //     placement: 'top'
          //   },
          //   nr
          // )
        }
        sums[index] = h('div', [makeTip(sums[index]), makeTip(_this.$utils.formatNumber(1111111))])
      }
    })
    return sums
  }

  /**
   * 多选
   */
  const handleSelectionChange = (val) => {
    state.multipleSelection = val
  }

  /**
   * 搜索
   */
  const searchData = () => {
    state.pagerParams.pageNum = 1
    if (typeof state.pageFunc === 'function') {
      state.pageFunc()
    } else {
      getApiList(null, null, null)
    }
  }

  /**
   * 重置
   */
  const resetData = ref({})
  const reset = () => {
    for (const k in state.params) {
      state.params[k] = resetData.value[k] || ''
    }
  }

  return {
    ...toRefs(state),
    tableRef,
    pageSizeChange,
    pageCurrentChange,
    getSummaries,
    getApiList,
    searchData,
    reset,
    resetData,
    handleSelectionChange
  }
}

import { useI18n } from '@/hooks/web/useI18n'

export const useFilter = () => {
  const { t } = useI18n()
  const datePickeShortcuts = [
    {
      text: t('common.dateToday'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        return [start, end]
      }
    },
    {
      text: t('common.dateYesterday'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        return [start, end]
      }
    },
    {
      text: t('common.datePast7'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return [start, end]
      }
    },
    {
      text: t('common.datePast14'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 14)
        return [start, end]
      }
    },
    {
      text: t('common.datePast30'),
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return [start, end]
      }
    }
  ]

  return {
    datePickeShortcuts
  }
}

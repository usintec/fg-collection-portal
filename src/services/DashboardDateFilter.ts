import { FilterMethod, type IFilterReport } from '@/services/types'

class FilterDate {
  readonly setDateRange = (firstDayOfTheWeek: Date, lastDayOfTheWeek: Date) => {
    const [year, month, day] = [
      firstDayOfTheWeek.toLocaleString('default', { year: 'numeric' }),
      firstDayOfTheWeek.toLocaleString('default', { month: '2-digit' }),
      firstDayOfTheWeek.toLocaleString('default', { day: '2-digit' })
    ]
    const [endYear, endMonth, endDay] = [
      lastDayOfTheWeek.toLocaleString('default', { year: 'numeric' }),
      lastDayOfTheWeek.toLocaleString('default', { month: '2-digit' }),
      lastDayOfTheWeek.toLocaleString('default', { day: '2-digit' })
    ]
    return { year, month, day, endYear, endMonth, endDay }
  }
  readonly filter = (filterData: IFilterReport) => {
    const todayDate = new Date()
    switch (filterData.duration) {
      case FilterMethod.Today: {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth())
        const end = new Date(today.getFullYear(), today.getMonth())
        const newDate = this.setDateRange(start, end)
        filterData.startDate = `${newDate.year}-${newDate.month}-${newDate.day}T00:00`
        filterData.endDate = `${newDate.endYear}-${newDate.endMonth}-${newDate.endDay}T12:00`
        break
      }
      case FilterMethod.ThisWeek: {
        const firstDayOfTheWeek = new Date(
          todayDate.setDate(todayDate.getDate() - todayDate.getDay())
        )
        const lastDayOfTheWeek = new Date(
          todayDate.setDate(todayDate.getDate() - todayDate.getDay() + 6)
        )
        const newDate = this.setDateRange(firstDayOfTheWeek, lastDayOfTheWeek)
        filterData.startDate = `${newDate.year}-${newDate.month}-${newDate.day}`
        filterData.endDate = `${newDate.endYear}-${newDate.endMonth}-${newDate.endDay}`
        break
      }
      case FilterMethod.Last30Days: {
        const newDateDay = this.setDateRange(
          new Date(new Date().setDate(new Date().getDate() - 30)),
          new Date()
        )
        filterData.startDate = `${newDateDay.year}-${newDateDay.month}-${newDateDay.day}`
        filterData.endDate = `${newDateDay.endYear}-${newDateDay.endMonth}-${newDateDay.endDay}`
        break
      }
      case FilterMethod.ThisMonth: {
        const date = new Date()
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const newDateMonth = this.setDateRange(firstDay, lastDay)
        filterData.startDate = `${newDateMonth.year}-${newDateMonth.month}-${newDateMonth.day}`
        filterData.endDate = `${newDateMonth.endYear}-${newDateMonth.endMonth}-${newDateMonth.endDay}`
        break
      }
      case FilterMethod.Last90Days: {
        const resolvedDate = this.setDateRange(
          new Date(new Date().setDate(new Date().getDate() - 90)),
          new Date()
        )
        filterData.startDate = `${resolvedDate.year}-${resolvedDate.month}-${resolvedDate.day}`
        filterData.endDate = `${resolvedDate.endYear}-${resolvedDate.endMonth}-${resolvedDate.endDay}`
        break
      }
      case FilterMethod.ThisYear: {
        const start = new Date(new Date().getFullYear(), 0, 1)
        const end = new Date(new Date().getFullYear(), 11, 31)
        const newDateYear = this.setDateRange(start, end)
        filterData.startDate = `${newDateYear.year}-${newDateYear.month}-${newDateYear.day}`
        filterData.endDate = `${newDateYear.endYear}-${newDateYear.endMonth}-${newDateYear.endDay}`
        break
      }
      default:
        break
    }
  }
}

export default new FilterDate()

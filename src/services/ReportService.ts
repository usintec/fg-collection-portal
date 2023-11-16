import { BaseService } from './BaseService'
import type {
  ICollection,
  ICollectionTrend,
  IOrganizationReport,
  PaginatedResult,
  RootAPIResponse
} from './types'
import { useOrganizationStore } from '@/stores/organizationStore'
class ReportService extends BaseService {
  constructor() {
    super('reports')
  }

  readonly getOrganizationReport = async (): Promise<IOrganizationReport> => {
    const url = this.getUrl(`organization`)
    const response = await this.doRequest<RootAPIResponse<IOrganizationReport>>({
      url
    })
    return response.value
  }

  readonly getOrganizationCollection = async (
    startDate?: string,
    endDate?: string,
    pageIndex: number = 1,
    pageSize: number = 5,
    sortColumn: string = 'CreatedOn',
    order: string = 'DESC'
  ): Promise<ICollection[]> => {
    let url
    if (startDate && endDate)
      url = this.getUrl(
        `collections?PageIndex=${pageIndex}&PageSize=${pageSize}&SortColumn=${sortColumn}&Order=${order}&searchFilter={"startDate": "${startDate}", "endDate": "${endDate}"}`
      )
    else url = this.getUrl(`collections`)
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<ICollection>>>({
      url
    })
    return response.value.result
  }

  readonly getOrganizationCollectionTrend = async (
    currency: string = 'NGN',
    trendType: string = 'Daily',
    startDate: string = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    endDate: string = new Date().toISOString().split('T')[0]
  ): Promise<ICollectionTrend> => {
    const orgStore = useOrganizationStore()
    const orgId = orgStore?.fg_id
    const url = this.getUrl(
      `collections-trend?Currency=${currency}&TrendType=${trendType}&OrganizationId=${orgId}&EndDate=${endDate}&StartDate=${startDate}`
    )
    const response = await this.doRequest<RootAPIResponse<ICollectionTrend>>({
      url
    })
    return response.value
  }
}

export default new ReportService()

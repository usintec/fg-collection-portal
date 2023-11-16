import { defineStore } from 'pinia'
import type {
  IBill,
  IBillInvoiceModel,
  ICustomerRead,
  LineItem,
  PayableItemModel
} from '@/services/types'
import { usePayableItems } from './payableItemStore'

interface State {
  customer: ICustomerRead | null
  state: Partial<IBill>
  errorMessage?: Partial<IBill>
  payableItems: PayableItemModel[]
  type: string
}

export const useCreateBillStore = defineStore('createBillStore', {
  state: () =>
    ({
      customer: null,
      state: {},
      errorMessage: undefined,
      payableItems: [],
      type: 'OneOff'
    } as State),
  actions: {
    setState(key: keyof IBill, value: any) {
      this.state = { ...this.state, [key]: value }
      this.errorMessage = { ...this.errorMessage, [key]: undefined }
    },
    setErrorMessage(key: keyof IBill, message: string) {
      this.errorMessage = { ...this.errorMessage, [key]: message }
    },
    customerClick(v: ICustomerRead) {
      this.customer = v
      this.setState('customerId', v.id)
    },
    removeCustomer() {
      this.customer = null
      this.setState('customerId', '')
    },
    pushPayableItem(item: PayableItemModel) {
      const store = usePayableItems()
      const itemFound = this.payableItems.find((i) => i.payableItemId === item.payableItemId)
      if (itemFound) return
      this.setErrorMessage('lineItems', '')
      this.payableItems.push(item)
      store.pushItem(item)
    },
    removeItem(id: string) {
      const store = usePayableItems()
      this.payableItems = this.payableItems.filter((i) => i.payableItemId !== id)
      store.removeItem(id)
    },
    setType(type: string) {
      this.type = type
    },
    fromBill(bill: IBillInvoiceModel) {
      const store = usePayableItems()
      store.clearAll()
      this.payableItems = []
      const items: LineItem[] = []
      bill.invoices.forEach((invoice) => {
        invoice.lineItems.forEach((lineItem) => items.push(lineItem))
      })
      items.forEach((value) => {
        const item: PayableItemModel = {
          additionalInformation: value?.additionalInformation ?? {},
          payableItemId: value.id,
          name: value.name,
          currency: value.currency ?? '',
          currencyCode: value.currency ?? '',
          description: value.description,
          priceType: '',
          price: value.price,
          priceRange: value.priceRange ?? { min: '', max: '' },
          quantity: value.quantity,
          gifmisCode: value.gifmisCode,
          vat: {
            fee: 0,
            type: '',
            maximumFee: 0,
            isApplyable: false
          },
          organizationId: '',
          stampDuty: {
            fee: '',
            isApplyable: false
          },
          isLocked: false
        }
        this.payableItems.push(item)
        store.pushItem(item)
      })
      store.setOriginalItems(this.payableItems)
      this.customerClick(bill.customer)
      const _bill = bill as unknown as IBill
      this.state = { ...this.state, ..._bill }
      this.type = 'OneOff'
    },
    clear() {
      const store = usePayableItems()
      this.customer = null
      this.state = {}
      this.errorMessage = undefined
      this.payableItems = []
      this.type = 'OneOff'
      store.clearAll()
    }
  }
})

import { defineStore } from 'pinia'
import type { IBill } from '@/services/types'

interface State {
  bill: Partial<IBill>
  detailBillId?: string
}

export const useBillStore = defineStore('billStore', {
  state: () =>
    ({
      bill: {}
    } as State),
  actions: {
    storeBill(activeBill: Partial<IBill>) {
      this.bill = activeBill
    },
    clearBill() {
      this.bill = {}
    },
    setDetailBill(bill: string) {
      this.detailBillId = bill
    }
  }
})

import type { PayableItemModel, Vat } from '@/services/types'
import { defineStore } from 'pinia'

interface LineItems {
  id: string
  tax: number
  quantity: number
  price: number
  currency: string
  additionalInformation: Record<string, string>
}

interface IState {
  items: LineItems[]
  originalItems: PayableItemModel[]
  summery: Record<string, number>
}

const taxCalc = (tax: Vat, price: number) => {
  if (tax.type === 'Flat') {
    return tax.fee
  } else {
    const _tax = price * (tax.fee / 100)
    let v
    if (tax.maximumFee) v = _tax > tax.maximumFee ? tax.maximumFee : _tax
    else v = _tax
    return Number(v.toFixed(2))
  }
}

export const usePayableItems = defineStore('payableItemStore', {
  state: () =>
    ({
      items: [],
      originalItems: [],
      summery: {} as Record<string, number>
    } as IState),
  actions: {
    pushItem(item: PayableItemModel) {
      const _item = {
        id: item.payableItemId,
        tax: taxCalc(item.vat, item.price ?? item.priceRange.min),
        quantity: item.quantity ?? 1,
        price: item.price ?? item.priceRange.min,
        currency: item.currencyCode,
        additionalInformation: {}
      }
      this.items.push(_item)
      this.originalItems.push(item)
      this.summery = this.getCurrency()
    },
    setOriginalItems(orgItems: PayableItemModel[]) {
      this.originalItems = orgItems
    },
    removeItem(id: string) {
      this.items = this.items.filter((i) => i.id !== id)
      this.summery = this.getCurrency()
    },
    getCurrency(): Record<string, number> {
      const v: Record<string, number> = {}
      for (const i of this.items) {
        if (v[i.currency]) {
          v[i.currency] += (i.price + i.tax) * i.quantity
        } else {
          v[i.currency] = (i.price + i.tax) * i.quantity
        }
      }
      return v
    },
    adjustQuantity(id: string, quantity: number) {
      const _i = this.items.findIndex((i) => i.id === id)
      if (_i > -1) {
        const _item = this.items[_i]
        _item.quantity = quantity
        this.items[_i] = _item
        this.summery = this.getCurrency()
      }
    },
    adjustPrice(id: string, price: number) {
      const _i = this.originalItems.findIndex((i) => i.payableItemId === id)
      const itemId = this.items.findIndex((i) => i.id === id)
      if (_i > -1 && itemId > -1) {
        const _item = this.items[itemId]
        const _originalItem = this.originalItems[_i]
        if (_originalItem.priceRange?.max) {
          _item.price =
            Number(_originalItem.priceRange.max) > price
              ? Number(_originalItem.priceRange.min) < price
                ? price
                : Number(_originalItem.priceRange.min)
              : Number(_originalItem.priceRange.max)
        }
        _item.tax = taxCalc(_originalItem.vat, _item.price)
        this.items[_i] = _item
        this.summery = this.getCurrency()
      }
    },
    addCustomFiled(id: string, data: Record<string, string>) {
      const _i = this.items.findIndex((i) => i.id === id)
      if (_i > -1) {
        const _item = this.items[_i]
        _item.additionalInformation = data
        this.items[_i] = _item
      }
    },
    readyForCheckout() {
      return this.items.map((i) => ({
        ...i,
        tax: {
          type: 'Flat',
          value: i.tax
        }
      }))
    },
    getQuantity(id: string) {
      const _i = this.items.findIndex((i) => i.id === id)
      if (_i > -1) {
        return this.items[_i].quantity
      }
      return 1
    },
    clearAll() {
      this.items = []
      this.summery = {}
    }
  }
})

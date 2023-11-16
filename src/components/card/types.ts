export enum currencyEnum {
  USD = 'USD',
  NGN = 'NGN',
  NONE = 'NONE'
}
export interface ICard {
  title: string
  amount: string
  currency: currencyEnum
  icon: string
  itemCount: string
  itemPercentage: string
  onClick?: () => void
}

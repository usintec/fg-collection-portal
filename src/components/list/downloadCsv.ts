import type { IListColumn } from './types'

export const downloadCsv = <T>(
  header: IListColumn<T>[],
  body: T[],
  name: string,
  template = false
) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    header
      .map(
        (h) => (template ? h.dataFiled.toString() : h.name) + (h.required && template ? '*' : '')
      )
      .join(',') +
    '\n' +
    body.map((row) => header.map((h) => row[h.dataFiled]).join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${name}.csv`)
  document.body.appendChild(link)
  link.click()
}

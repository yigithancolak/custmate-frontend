export const calculatePageCount = (
  totalCount: number,
  pageSize: number
): number => {
  return Math.ceil(totalCount / pageSize)
}

export type TotalEarning = {
  TRY: number
  EUR: number
  USD: number
}

// export const calculateTotalEarning = (
//   earnings: EarningItem[]
// ): TotalEarning => {
//   let TRY = 0
//   let EUR = 0
//   let USD = 0

//   for (let earning of earnings) {
//     TRY += earning.try
//     EUR += earning.eur
//     USD += earning.usd
//   }

//   return { TRY, EUR, USD }
// }

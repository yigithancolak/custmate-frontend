export const calculatePageCount = (
  totalCount: number,
  pageSize: number
): number => {
  return Math.ceil(totalCount / pageSize)
}

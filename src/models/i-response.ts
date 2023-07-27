export type IResponse<T> = {
  ok: boolean
  message: string
  result?: T,
}

export type ControllerResponse<T> = {
  ok: boolean
  message: string
  result?: T,
}

/**
 * @swagger
 * definitions:
 *  IResponse:
 *    ok:
 *      type: boolean
 *    message:
 *      type: string
 */
export type IResponse<T> = {
  ok: boolean
  message: string
  result?: T,
}

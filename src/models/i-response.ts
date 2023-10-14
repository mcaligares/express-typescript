/**
 * @swagger
 * definitions:
 *  response:
 *    empty:
 *      description: Response without result
 *      schema:
 *        type: object
 *        properties:
 *          ok:
 *            type: boolean
 *          message:
 *            type: string
 *    invalid:
 *      description: Response with invalid data
 *      schema:
 *        type: object
 *        properties:
 *          ok:
 *            type: boolean
 *          message:
 *            type: string
 */

export type IResponse<T> = {
  ok: boolean
  message: string
  result?: T,
}

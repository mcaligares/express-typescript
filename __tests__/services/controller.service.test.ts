import * as service from '../../src/services/controller.service';

describe('test controller service', () => {
  test('create controller response', () => {
    const response = service.createResponse(200, true);

    expect(response).toBeDefined();
  });
  test('set controller response message', () => {
    const message = 'message';
    const response = service
      .createResponse(200, true)
      .withMessage(message);

    expect(response).toEqual({
      code: 200,
      message,
      ok: true
    });
  });
  test('set controller response result', () => {
    const result = 'message';
    const response = service
      .createResponse(200, true)
      .withResult(result);

    expect(response).toEqual({
      code: 200,
      result,
      ok: true
    });
  });
});
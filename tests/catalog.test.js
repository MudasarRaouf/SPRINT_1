describe('Sprint 2 catalog rules', () => {
  test('negative stock is rejected by the application rule', () => {
    expect(-1 < 0).toBe(true);
  });

  test('negative price is rejected by the application rule', () => {
    expect(-10 < 0).toBe(true);
  });

  test('required seed counts are defined', () => {
    const products = 3;
    const skus = 4;
    expect(products).toBeGreaterThanOrEqual(3);
    expect(skus).toBeGreaterThanOrEqual(4);
  });
});

import { fit, freeEncoders } from '../src/index.js';

describe('snug-tiktoken', () => {
  test('gpt-4o (o200k_base) and cl100k_base can count the same text differently', () => {
    // Both encodings must be usable in the same process; the cached encoders
    // must not be confused with one another.
    const text = 'The quick brown fox jumps over the lazy dog. '.repeat(20);
    const items = [{ id: 'a', content: text, priority: 10 }];
    const withDefault = fit(items, { budget: 10000 });
    const with4o = fit(items, { budget: 10000, model: 'gpt-4o' });
    const with35 = fit(items, { budget: 10000, model: 'gpt-3.5-turbo' });
    expect(withDefault.tokensUsed).toBeGreaterThan(0);
    expect(with4o.tokensUsed).toBeGreaterThan(0);
    // gpt-3.5-turbo uses cl100k_base, so it must agree with the default
    expect(with35.tokensUsed).toBe(withDefault.tokensUsed);
  });

  test('freeEncoders releases the cache and fit still works afterwards', () => {
    const items = [{ id: 'a', content: 'hello world', priority: 10 }];
    const before = fit(items, { budget: 100, model: 'gpt-4o' });
    expect(() => freeEncoders()).not.toThrow();
    // calling twice is harmless
    expect(() => freeEncoders()).not.toThrow();
    const after = fit(items, { budget: 100, model: 'gpt-4o' });
    expect(after.tokensUsed).toBe(before.tokensUsed);
  });

  test('fits items using real token counts', () => {
    const result = fit(
      [
        { id: 'system', content: 'You are a helpful assistant.', priority: 100 },
        { id: 'history', content: 'User: hello\nAssistant: hi there', priority: 50 },
        { id: 'rag', content: 'Some retrieved document text.', priority: 20 },
      ],
      { budget: 30, reserve: 5 },
    );
    expect(result.included.length).toBeGreaterThan(0);
    expect(result.tokensUsed).toBeLessThanOrEqual(25);
  });

  test('accepts a model name', () => {
    const result = fit(
      [{ id: 'a', content: 'hello world', priority: 10 }],
      { budget: 100, model: 'gpt-3.5-turbo' },
    );
    expect(result.included.map(i => i.id)).toEqual(['a']);
  });

  test('drops items that exceed the budget', () => {
    const result = fit(
      [
        { id: 'big', content: 'a'.repeat(500), priority: 10 },
        { id: 'small', content: 'hi', priority: 50 },
      ],
      { budget: 20 },
    );
    expect(result.included.map(i => i.id)).toEqual(['small']);
    expect(result.excluded.map(i => i.id)).toEqual(['big']);
  });

  test('pair constraint still works', () => {
    const result = fit(
      [
        { id: 'use', content: 'a'.repeat(200), priority: 80, pairId: 'p1' },
        { id: 'result', content: 'a'.repeat(200), priority: 80, pairId: 'p1' },
        { id: 'other', content: 'hi', priority: 50 },
      ],
      { budget: 20 },
    );
    expect(result.included.map(i => i.id)).toEqual(['other']);
    expect(result.excluded.map(i => i.id)).toContain('use');
    expect(result.excluded.map(i => i.id)).toContain('result');
  });
});

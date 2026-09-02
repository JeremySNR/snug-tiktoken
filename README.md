# @jeremysnr/snug-tiktoken

[![npm](https://img.shields.io/npm/v/@jeremysnr/snug-tiktoken)](https://www.npmjs.com/package/@jeremysnr/snug-tiktoken)
[![license](https://img.shields.io/npm/l/@jeremysnr/snug-tiktoken)](./LICENSE)

[snug](https://github.com/JeremySNR/snug) pre-wired with [tiktoken](https://github.com/openai/tiktoken). Token counting for OpenAI models with no setup.

```ts
import { fit } from '@jeremysnr/snug-tiktoken';

const result = fit(
  [
    { id: 'system',  content: systemPrompt,  priority: 100 },
    { id: 'history', content: chatHistory,   priority:  60 },
    { id: 'rag',     content: retrievedDocs, priority:  40 },
  ],
  { budget: 8192, reserve: 1024, model: 'gpt-4o' },
);
```

## Which encoding is used

- With no `model`, text is counted with the `cl100k_base` encoding (the one used by `gpt-4` and `gpt-3.5-turbo`).
- Pass `model` to get the exact encoding for that OpenAI model. `gpt-4o` and newer models use `o200k_base`, which produces different counts from `cl100k_base`, so pass the model name whenever you know it.

```ts
fit(items, { budget: 4096, model: 'gpt-4o' });
fit(items, { budget: 4096, model: 'gpt-3.5-turbo' });
```

**Anthropic models are not covered by tiktoken.** Claude uses its own tokenizer and tiktoken counts for it are approximate. For exact numbers call Anthropic's [count_tokens endpoint](https://docs.anthropic.com/en/api/messages-count-tokens) and pass the result through each item's `tokens` field, which bypasses the tokenizer:

```ts
{ id: 'msg', content: msg, priority: 50, tokens: input_tokens }
```

Otherwise treat the count as an estimate and keep a generous `reserve`.

## Encoder caching

tiktoken encoders are WASM objects and are slow to construct. This package creates one per model or encoding and keeps it for the life of the process. If you need to release that memory (for example in a long-running worker after a burst of work), call `freeEncoders()`; the next `fit()` recreates encoders as needed.

```ts
import { freeEncoders } from '@jeremysnr/snug-tiktoken';
freeEncoders();
```

## Install

```
npm install @jeremysnr/snug-tiktoken
```

## Why

`@jeremysnr/snug` is zero-dependency and requires you to supply a tokenizer. This package removes that step for the common OpenAI case.

## Licence

MIT

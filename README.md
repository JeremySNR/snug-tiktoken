# @jeremysnr/snug-tiktoken

[![npm](https://img.shields.io/npm/v/@jeremysnr/snug-tiktoken)](https://www.npmjs.com/package/@jeremysnr/snug-tiktoken)
[![license](https://img.shields.io/npm/l/@jeremysnr/snug-tiktoken)](./LICENSE)

[snug](https://github.com/JeremySNR/snug) pre-wired with [tiktoken](https://github.com/openai/tiktoken). Accurate token counting for OpenAI and Anthropic models with no setup.

```ts
import { fit } from '@jeremysnr/snug-tiktoken';

const result = fit(
  [
    { id: 'system',  content: systemPrompt,  priority: 100 },
    { id: 'history', content: chatHistory,   priority:  60 },
    { id: 'rag',     content: retrievedDocs, priority:  40 },
  ],
  { budget: 8192, reserve: 1024 },
);
```

Defaults to `cl100k_base` encoding, which is accurate for all current OpenAI and Anthropic models. Pass `model` to use a model-specific encoding:

```ts
fit(items, { budget: 4096, model: 'gpt-3.5-turbo' });
```

## Install

```
npm install @jeremysnr/snug-tiktoken
```

## Why

`@jeremysnr/snug` is zero-dependency and requires you to supply a tokenizer. This package removes that step for the common case.

## Licence

MIT

import { encoding_for_model, get_encoding, type Tiktoken, type TiktokenModel } from 'tiktoken';
import { fit as snugFit } from '@jeremysnr/snug';
import type { Item, FitOptions, FitResult } from '@jeremysnr/snug';

export type { Item, FitOptions, FitResult };

export interface FitWithModelOptions extends Omit<FitOptions, 'tokenizer'> {
  /**
   * OpenAI model name, used to pick the matching tiktoken encoding
   * (for example gpt-4o uses o200k_base; gpt-4 and gpt-3.5-turbo use
   * cl100k_base). When omitted, cl100k_base is used.
   */
  model?: TiktokenModel;
}

const DEFAULT_ENCODING = 'cl100k_base';

/**
 * Encoders are WASM objects that are expensive to construct, so they are
 * created once per model or encoding and kept for the life of the module.
 * Call freeEncoders() to release them.
 */
const encoders = new Map<string, Tiktoken>();

function getEncoder(model?: TiktokenModel): Tiktoken {
  const key = model ? `model:${model}` : `encoding:${DEFAULT_ENCODING}`;
  let enc = encoders.get(key);
  if (!enc) {
    enc = model ? encoding_for_model(model) : get_encoding(DEFAULT_ENCODING);
    encoders.set(key, enc);
  }
  return enc;
}

/**
 * Release every cached tiktoken encoder and the WASM memory behind it.
 * The next call to fit() will create encoders again as needed.
 */
export function freeEncoders(): void {
  for (const enc of encoders.values()) enc.free();
  encoders.clear();
}

/**
 * fit() pre-wired with tiktoken.
 *
 * With no `model`, text is counted with the cl100k_base encoding. Pass
 * `model` to get the exact encoding for a given OpenAI model (gpt-4o and
 * newer use o200k_base, which counts differently from cl100k_base).
 *
 * tiktoken only implements OpenAI encodings. Anthropic models use their own
 * tokenizer, so counts for Claude are approximate; for exact numbers use the
 * Anthropic count_tokens endpoint and pass the result via each item's
 * `tokens` field, which bypasses the tokenizer entirely.
 */
export function fit<T extends Item>(items: T[], options: FitWithModelOptions): FitResult<T> {
  const enc = getEncoder(options.model);
  const { model: _model, ...rest } = options;
  return snugFit(items, {
    ...rest,
    tokenizer: (text) => enc.encode(text).length,
  });
}

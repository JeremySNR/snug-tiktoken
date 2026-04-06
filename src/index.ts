import { encoding_for_model, get_encoding, type TiktokenModel } from 'tiktoken';
import { fit as snugFit } from '@jeremysnr/snug';
import type { Item, FitOptions, FitResult } from '@jeremysnr/snug';

export type { Item, FitOptions, FitResult };

export interface FitWithModelOptions extends Omit<FitOptions, 'tokenizer'> {
  /** tiktoken model name. Defaults to 'gpt-4o'. */
  model?: TiktokenModel;
}

/**
 * fit() pre-wired with tiktoken. Accepts an optional model name — defaults
 * to gpt-4o (cl100k_base), which is accurate for all current OpenAI and
 * Anthropic models.
 */
export function fit<T extends Item>(items: T[], options: FitWithModelOptions): FitResult<T> {
  const enc = options.model
    ? encoding_for_model(options.model)
    : get_encoding('cl100k_base');

  try {
    return snugFit(items, {
      ...options,
      tokenizer: (text) => enc.encode(text).length,
    });
  } finally {
    enc.free();
  }
}

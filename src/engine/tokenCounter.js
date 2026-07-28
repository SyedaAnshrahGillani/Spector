/**
 * SPECTOR V2 - Token Counter & LLM API Cost Estimator Engine
 * Estimates token counts and API costs for prompts and datasets.
 */

export class TokenCounter {
  // Approximate average characters per token across common LLM tokenizers
  static CHARS_PER_TOKEN = 4.0;

  static MODEL_PRICING = {
    'gpt-4o': { inputPer1k: 0.0025, outputPer1k: 0.01 },
    'claude-3-5-sonnet': { inputPer1k: 0.003, outputPer1k: 0.015 },
    'llama-3-70b-open': { inputPer1k: 0.0006, outputPer1k: 0.0008 }
  };

  /**
   * Estimate tokens in a text string
   */
  static countTokens(text) {
    if (!text) return 0;
    const str = typeof text === 'string' ? text : JSON.stringify(text);
    return Math.ceil(str.length / this.CHARS_PER_TOKEN);
  }

  /**
   * Estimate total tokens across all records in a dataset
   */
  static estimateDatasetTokens(records) {
    if (!records || records.length === 0) return { totalTokens: 0, avgTokensPerRecord: 0 };

    let totalChars = 0;
    records.forEach(rec => {
      totalChars += JSON.stringify(rec).length;
    });

    const totalTokens = Math.ceil(totalChars / this.CHARS_PER_TOKEN);
    const avgTokensPerRecord = Math.ceil(totalTokens / records.length);

    return {
      totalTokens,
      avgTokensPerRecord
    };
  }

  /**
   * Estimate cost across supported model families
   */
  static calculateCosts(totalTokens) {
    const costs = {};
    const kTokens = totalTokens / 1000;

    for (const [model, rates] of Object.entries(this.MODEL_PRICING)) {
      const estimatedCost = kTokens * rates.inputPer1k;
      costs[model] = estimatedCost.toFixed(4);
    }

    return costs;
  }
}

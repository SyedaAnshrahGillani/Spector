/**
 * SPECTOR V2 - Client-Side PII Masking & Privacy Guard Engine
 * Redacts sensitive user data (emails, IPs, secret tokens, credit cards, SSNs) 100% locally.
 */

export class PIIMasker {
  static PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    ip: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    apiToken: /(?:sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|bearer\s+[a-zA-Z0-9\-._~+/]+=*)/gi,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g
  };

  /**
   * Mask PII fields across all records in dataset
   */
  static maskDataset(records, options = { email: true, ip: true, creditCard: true, apiToken: true, ssn: true }) {
    if (!records || records.length === 0) return records;

    return records.map(record => {
      const maskedRow = {};
      for (const [key, val] of Object.entries(record)) {
        if (typeof val === 'string') {
          maskedRow[key] = this.maskText(val, options);
        } else if (typeof val === 'object' && val !== null) {
          maskedRow[key] = JSON.parse(this.maskText(JSON.stringify(val), options));
        } else {
          maskedRow[key] = val;
        }
      }
      return maskedRow;
    });
  }

  static maskText(text, options) {
    let result = text;

    if (options.email) {
      result = result.replace(this.PATTERNS.email, '[REDACTED_EMAIL]');
    }
    if (options.ip) {
      result = result.replace(this.PATTERNS.ip, '[REDACTED_IP]');
    }
    if (options.creditCard) {
      result = result.replace(this.PATTERNS.creditCard, '[REDACTED_CARD]');
    }
    if (options.apiToken) {
      result = result.replace(this.PATTERNS.apiToken, '[REDACTED_API_TOKEN]');
    }
    if (options.ssn) {
      result = result.replace(this.PATTERNS.ssn, '[REDACTED_SSN]');
    }

    return result;
  }
}

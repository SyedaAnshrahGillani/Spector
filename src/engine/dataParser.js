/**
 * SPECTOR V2 - Multi-Format Data Parser Engine
 * Handles JSON, JSONL, CSV, and TSV formats cleanly with resilient fallbacks.
 */

export class DataParser {
  /**
   * Parse raw string content using robust format detection & fallbacks
   */
  static parse(content, fileName = '') {
    if (!content || !content.trim()) return [];

    // Strip BOM character if present
    let cleanContent = content.trim();
    if (cleanContent.charCodeAt(0) === 0xFEFF) {
      cleanContent = cleanContent.slice(1).trim();
    }

    const ext = fileName.split('.').pop().toLowerCase();

    // Strategy 1: Explicit CSV/TSV extension
    if (ext === 'csv' || ext === 'tsv') {
      return this.parseCSV(cleanContent, ext === 'tsv' ? '\t' : ',');
    }

    // Strategy 2: Explicit JSONL extension
    if (ext === 'jsonl') {
      try {
        return this.parseJSONL(cleanContent);
      } catch (err) {
        // Fallback try full JSON if single JSON array was named .jsonl by mistake
        return this.parseJSON(cleanContent);
      }
    }

    // Strategy 3: Try full JSON parse (handles formatted .json objects & arrays)
    try {
      return this.parseJSON(cleanContent);
    } catch (e1) {
      // Strategy 4: Try JSONL line-by-line parse
      try {
        return this.parseJSONL(cleanContent);
      } catch (e2) {
        // Strategy 5: Fallback to CSV parse
        return this.parseCSV(cleanContent, ',');
      }
    }
  }

  static parseJSON(content) {
    const data = JSON.parse(content);
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) return [data];
    throw new Error("Invalid JSON structure: Expected object or array of objects.");
  }

  static parseJSONL(content) {
    const lines = content.split(/\r?\n/);
    const records = [];
    let errorCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        records.push(JSON.parse(line));
      } catch (err) {
        errorCount++;
      }
    }

    if (records.length === 0) {
      throw new Error("Failed to parse JSONL file. No valid JSON lines found.");
    }
    return records;
  }

  static parseCSV(content, delimiter = ',') {
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];

    const headers = this.parseCSVLine(lines[0], delimiter);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i], delimiter);
      if (values.length === 0) continue;

      const row = {};
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j] || `col_${j+1}`;
        let val = values[j] !== undefined ? values[j] : null;

        // Auto-cast numbers and booleans
        if (val !== null) {
          if (val.toLowerCase() === 'true') val = true;
          else if (val.toLowerCase() === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
        }
        row[key] = val;
      }
      records.push(row);
    }
    return records;
  }

  static parseCSVLine(line, delimiter = ',') {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  /**
   * Auto-extract column schemas and infer types
   */
  static extractColumns(records) {
    if (!records || records.length === 0) return [];
    const colSet = new Set();
    records.slice(0, 100).forEach(rec => {
      if (typeof rec === 'object' && rec !== null) {
        Object.keys(rec).forEach(key => colSet.add(key));
      }
    });
    return Array.from(colSet);
  }
}

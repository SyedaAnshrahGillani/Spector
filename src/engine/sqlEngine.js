/**
 * SPECTOR V2 - In-Browser SQL Query Engine
 * Allows executing SQL queries (SELECT, WHERE, ORDER BY, LIMIT, LIKE, etc.) over loaded records.
 */

export class SQLEngine {
  /**
   * Execute a SQL-like query over an array of JSON objects in-browser
   */
  static query(records, sqlString) {
    if (!records || records.length === 0) return [];
    if (!sqlString || !sqlString.trim()) return records;

    const queryLower = sqlString.trim().toLowerCase();
    let results = [...records];

    try {
      // 1. Handle WHERE filtering
      const whereMatch = sqlString.match(/WHERE\s+(.*?)(?=\s+(GROUP|ORDER|LIMIT)|$)/i);
      if (whereMatch && whereMatch[1]) {
        const conditionStr = whereMatch[1].trim();
        results = results.filter(row => this.evaluateCondition(row, conditionStr));
      }

      // 2. Handle ORDER BY
      const orderMatch = sqlString.match(/ORDER\s+BY\s+([a-zA-Z0-9_\-]+)\s*(ASC|DESC)?/i);
      if (orderMatch && orderMatch[1]) {
        const col = orderMatch[1];
        const isDesc = (orderMatch[2] || '').toUpperCase() === 'DESC';

        results.sort((a, b) => {
          let valA = a[col];
          let valB = b[col];

          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;

          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();

          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // 3. Handle LIMIT
      const limitMatch = sqlString.match(/LIMIT\s+(\d+)/i);
      if (limitMatch && limitMatch[1]) {
        const limit = parseInt(limitMatch[1], 10);
        results = results.slice(0, limit);
      }

      // 4. Handle SELECT specific columns
      const selectMatch = sqlString.match(/^SELECT\s+(.*?)\s+FROM/i);
      if (selectMatch && selectMatch[1] && selectMatch[1].trim() !== '*') {
        const cols = selectMatch[1].split(',').map(c => c.trim());
        results = results.map(row => {
          const newRow = {};
          cols.forEach(c => {
            if (c in row) newRow[c] = row[c];
          });
          return newRow;
        });
      }

      return results;
    } catch (err) {
      console.warn("SQL Engine fallback error:", err);
      return records;
    }
  }

  static evaluateCondition(row, conditionStr) {
    // Simple expression parser for column = 'val', column > val, column LIKE '%val%'
    try {
      // LIKE operator
      if (/LIKE/i.test(conditionStr)) {
        const parts = conditionStr.split(/LIKE/i);
        const col = parts[0].trim();
        let pattern = parts[1].trim().replace(/^['"]|['"]$/g, '');
        pattern = pattern.replace(/%/g, '.*');
        const regex = new RegExp(`^${pattern}$`, 'i');
        return regex.test(String(row[col] || ''));
      }

      // Greater than / Less than
      if (conditionStr.includes('>')) {
        const [col, val] = conditionStr.split('>').map(s => s.trim());
        return Number(row[col]) > Number(val.replace(/['"]/g, ''));
      }
      if (conditionStr.includes('<')) {
        const [col, val] = conditionStr.split('<').map(s => s.trim());
        return Number(row[col]) < Number(val.replace(/['"]/g, ''));
      }

      // Equals =
      if (conditionStr.includes('=')) {
        const [col, val] = conditionStr.split('=').map(s => s.trim());
        const cleanVal = val.replace(/^['"]|['"]$/g, '');
        return String(row[col]).toLowerCase() === cleanVal.toLowerCase();
      }

      // Single word search across all fields
      const searchWord = conditionStr.replace(/^['"]|['"]$/g, '').toLowerCase();
      return Object.values(row).some(v => String(v).toLowerCase().includes(searchWord));
    } catch (e) {
      return true;
    }
  }
}

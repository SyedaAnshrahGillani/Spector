/**
 * SPECTOR V2 - Health & Statistical Analytics Dashboard Component
 */

import { TokenCounter } from '../engine/tokenCounter.js';
import { DataParser } from '../engine/dataParser.js';

export function renderHealthDashboard(containerEl, state, callbacks) {
  if (!state.showHealthCheck) {
    containerEl.innerHTML = '';
    return;
  }

  const records = state.records || [];
  const columns = DataParser.extractColumns(records);

  const { totalTokens, avgTokensPerRecord } = TokenCounter.estimateDatasetTokens(records);
  const costs = TokenCounter.calculateCosts(totalTokens);

  // Missing values stats per column
  const columnStats = columns.map(col => {
    let missingCount = 0;
    let totalLength = 0;

    records.forEach(r => {
      const val = r[col];
      if (val === undefined || val === null || val === '') missingCount++;
      else totalLength += String(val).length;
    });

    const filledCount = records.length - missingCount;
    const filledPercent = ((filledCount / (records.length || 1)) * 100).toFixed(1);
    const avgLen = Math.round(totalLength / (filledCount || 1));

    return { col, missingCount, filledPercent, avgLen };
  });

  containerEl.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-card" style="max-width: 900px;">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-subtle bg-header">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">📊 Dataset Health & Token Profiler</span>
            <span class="badge badge-emerald">${records.length.toLocaleString()} Total Records</span>
          </div>
          <button id="btnCloseHealth" class="btn btn-ghost text-lg">✕</button>
        </div>

        <div class="p-6 overflow-y-auto flex flex-col gap-6">
          <!-- Token & Cost Overview Cards -->
          <div class="grid grid-cols-3 gap-4" style="display: grid; grid-template-columns: repeat(3, 1fr);">
            <div class="glass-card p-4 flex flex-col">
              <span class="text-xs text-muted font-semibold uppercase">Total Token Estimate</span>
              <span class="text-xl font-bold font-mono text-indigo-400 mt-1">${totalTokens.toLocaleString()}</span>
              <span class="text-xs text-secondary mt-1">Avg ${avgTokensPerRecord} tokens / record</span>
            </div>

            <div class="glass-card p-4 flex flex-col">
              <span class="text-xs text-muted font-semibold uppercase">GPT-4o API Cost</span>
              <span class="text-xl font-bold font-mono text-emerald-400 mt-1">$${costs['gpt-4o']}</span>
              <span class="text-xs text-secondary mt-1">Input token pricing estimate</span>
            </div>

            <div class="glass-card p-4 flex flex-col">
              <span class="text-xs text-muted font-semibold uppercase">Claude 3.5 Sonnet</span>
              <span class="text-xl font-bold font-mono text-amber-400 mt-1">$${costs['claude-3-5-sonnet']}</span>
              <span class="text-xs text-secondary mt-1">Input token pricing estimate</span>
            </div>
          </div>

          <!-- Column Integrity Table -->
          <div>
            <h3 class="text-sm font-semibold mb-3">Field Completeness & Structure</h3>
            <table class="data-table" style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Completeness</th>
                  <th>Missing Count</th>
                  <th>Avg String Length</th>
                </tr>
              </thead>
              <tbody>
                ${columnStats.map(stat => `
                  <tr>
                    <td class="font-mono text-indigo-400">${stat.col}</td>
                    <td>
                      <div class="flex items-center gap-2">
                        <div style="flex:1; height:6px; background:var(--border-subtle); border-radius:3px; overflow:hidden;">
                          <div style="width:${stat.filledPercent}%; height:100%; background:var(--accent-emerald);"></div>
                        </div>
                        <span class="text-xs font-mono">${stat.filledPercent}%</span>
                      </div>
                    </td>
                    <td class="font-mono">${stat.missingCount}</td>
                    <td class="font-mono">${stat.avgLen} chars</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.querySelector('#btnCloseHealth')?.addEventListener('click', callbacks.onCloseHealth);
}

/**
 * SPECTOR V2 - Interactive Data Table Component
 */

import { DataParser } from '../engine/dataParser.js';

export function renderTableView(containerEl, state, callbacks) {
  const records = state.filteredRecords || state.records || [];
  const columns = DataParser.extractColumns(records);

  const page = state.currentPage || 1;
  const pageSize = state.pageSize || 25;
  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const pageRecords = records.slice(startIndex, startIndex + pageSize);

  containerEl.innerHTML = `
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Table Controls Bar -->
      <div class="control-bar flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <input type="text" id="searchInput" class="input-text" placeholder="🔍 Quick search fields..." value="${state.searchQuery || ''}" style="width: 240px;" />
          <span class="text-xs text-secondary font-mono">${records.length.toLocaleString()} records loaded</span>
        </div>

        <div class="flex items-center gap-2">
          <button id="btnSQLToggle" class="btn ${state.sqlActive ? 'btn-primary' : 'btn-ghost'} text-xs">
            <span>⚡ SQL Query</span>
          </button>
          
          <button id="btnExportJSONL" class="btn btn-ghost text-xs">
            <span>⬇️ Export .jsonl</span>
          </button>
          <button id="btnExportCSV" class="btn btn-ghost text-xs">
            <span>⬇️ Export .csv</span>
          </button>
        </div>
      </div>

      <!-- Data Table Wrap -->
      <div class="table-container">
        ${pageRecords.length === 0 ? `
          <div class="p-8 text-center text-muted">No matching records found.</div>
        ` : `
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                ${columns.map(col => `
                  <th class="cursor-pointer sortable-col" data-col="${col}">
                    ${col} ${state.sortCol === col ? (state.sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${pageRecords.map((row, idx) => `
                <tr class="table-row cursor-pointer" data-row-idx="${startIndex + idx}">
                  <td class="text-muted text-xs font-mono">${startIndex + idx + 1}</td>
                  ${columns.map(col => {
                    const val = row[col];
                    const valStr = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '');
                    return `<td title="${escapeHtml(valStr)}">${escapeHtml(valStr)}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>

      <!-- Pagination Footer -->
      <div class="pagination-bar flex items-center justify-between">
        <div class="text-xs text-muted">
          Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, records.length)} of ${records.length} records
        </div>

        <div class="flex items-center gap-1">
          <button id="btnPrevPage" class="btn btn-ghost text-xs" ${page <= 1 ? 'disabled' : ''}>◀ Prev</button>
          <span class="text-xs font-mono px-2">Page ${page} of ${totalPages}</span>
          <button id="btnNextPage" class="btn btn-ghost text-xs" ${page >= totalPages ? 'disabled' : ''}>Next ▶</button>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  containerEl.querySelector('#searchInput')?.addEventListener('input', (e) => {
    callbacks.onSearch(e.target.value);
  });

  containerEl.querySelector('#btnSQLToggle')?.addEventListener('click', callbacks.onToggleSQL);
  containerEl.querySelector('#btnExportJSONL')?.addEventListener('click', () => callbacks.onExport('jsonl'));
  containerEl.querySelector('#btnExportCSV')?.addEventListener('click', () => callbacks.onExport('csv'));

  containerEl.querySelector('#btnPrevPage')?.addEventListener('click', () => callbacks.onPageChange(page - 1));
  containerEl.querySelector('#btnNextPage')?.addEventListener('click', () => callbacks.onPageChange(page + 1));

  // Sorting
  containerEl.querySelectorAll('.sortable-col').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      callbacks.onSort(col);
    });
  });

  // Row click -> open JSON drawer
  containerEl.querySelectorAll('.table-row').forEach(tr => {
    tr.addEventListener('click', () => {
      const idx = parseInt(tr.getAttribute('data-row-idx'), 10);
      callbacks.onRowClick(records[idx], idx);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

/**
 * SPECTOR V2 STUDIO - Interactive Data Table Component
 * Features value auto-formatting, sticky header scrolling, & flexible page size selection.
 */

import { DataParser } from '../engine/dataParser.js';

export function renderTableView(containerEl, state, callbacks) {
  const records = state.filteredRecords || state.records || [];
  const columns = DataParser.extractColumns(records);

  const page = state.currentPage || 1;
  const pageSize = state.pageSize === 'all' ? (records.length || 1) : (parseInt(state.pageSize, 10) || 25);
  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const pageRecords = records.slice(startIndex, startIndex + pageSize);

  containerEl.innerHTML = `
    <div class="flex flex-col flex-1 overflow-hidden animate-fade-in" style="min-height: 0;">
      <!-- Table Controls Bar -->
      <div class="control-bar flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <input type="text" id="searchInput" class="input-text" placeholder="🔍 Quick search dataset..." value="${state.searchQuery || ''}" style="width: 260px;" />
          <span class="badge badge-indigo font-mono">${records.length.toLocaleString()} Records</span>
          ${state.filteredRecords && state.filteredRecords.length !== (state.records || []).length ? `
            <span class="badge badge-amber font-mono">Filtered from ${(state.records || []).length.toLocaleString()}</span>
          ` : ''}
        </div>

        <div class="flex items-center gap-2">
          <button id="btnSQLToggle" class="btn ${state.sqlActive ? 'btn-primary' : 'btn-ghost'} text-xs">
            <span>⚡ SQL Query Console</span>
          </button>
          
          <button id="btnExportJSONL" class="btn btn-ghost text-xs">
            <span>⬇️ Export JSONL</span>
          </button>
          <button id="btnExportCSV" class="btn btn-ghost text-xs">
            <span>⬇️ Export CSV</span>
          </button>
        </div>
      </div>

      <!-- Data Table Wrap -->
      <div class="table-container">
        ${pageRecords.length === 0 ? `
          <div class="p-12 text-center text-muted">No matching records found.</div>
        ` : `
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                ${columns.map(col => `
                  <th class="cursor-pointer sortable-col" data-col="${col}">
                    <div class="flex items-center gap-1">
                      <span>${col}</span>
                      <span class="text-xs text-muted">${state.sortCol === col ? (state.sortDir === 'asc' ? '▲' : '▼') : '↕'}</span>
                    </div>
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
                    return `<td>${formatCellValue(val)}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>

      <!-- Pagination Footer -->
      <div class="pagination-bar flex items-center justify-between">
        <div class="flex items-center gap-3 text-xs text-muted font-mono">
          <span>Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, records.length)} of ${records.length} records</span>
          
          <div class="flex items-center gap-1">
            <span>Rows per page:</span>
            <select id="selectPageSize" class="input-text text-xs py-1 px-2" style="width: auto;">
              <option value="25" ${state.pageSize == 25 ? 'selected' : ''}>25</option>
              <option value="50" ${state.pageSize == 50 ? 'selected' : ''}>50</option>
              <option value="100" ${state.pageSize == 100 ? 'selected' : ''}>100</option>
              <option value="500" ${state.pageSize == 500 ? 'selected' : ''}>500</option>
              <option value="all" ${state.pageSize === 'all' ? 'selected' : ''}>All</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button id="btnPrevPage" class="btn btn-ghost text-xs" ${page <= 1 ? 'disabled' : ''}>◀ Prev</button>
          <span class="text-xs font-mono px-2 text-indigo">Page ${page} of ${totalPages}</span>
          <button id="btnNextPage" class="btn btn-ghost text-xs" ${page >= totalPages ? 'disabled' : ''}>Next ▶</button>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  containerEl.querySelector('#searchInput')?.addEventListener('input', (e) => {
    callbacks.onSearch(e.target.value);
  });

  containerEl.querySelector('#selectPageSize')?.addEventListener('change', (e) => {
    callbacks.onPageSizeChange(e.target.value);
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

/**
 * Format cell value based on data type (Boolean badges, number coloring, array tags)
 */
function formatCellValue(val) {
  if (val === null || val === undefined) {
    return `<span class="text-muted text-xs font-mono">null</span>`;
  }
  if (typeof val === 'boolean') {
    return val 
      ? `<span class="badge badge-emerald">TRUE</span>`
      : `<span class="badge badge-rose">FALSE</span>`;
  }
  if (typeof val === 'number') {
    return `<span class="text-purple font-mono font-semibold">${val}</span>`;
  }
  if (Array.isArray(val)) {
    return val.map(t => `<span class="badge badge-indigo text-xs mr-1">${escapeHtml(String(t))}</span>`).join('');
  }
  if (typeof val === 'object') {
    return `<span class="text-xs font-mono text-indigo">{${Object.keys(val).length} fields}</span>`;
  }

  const str = String(val);
  return `<span title="${escapeHtml(str)}">${escapeHtml(str)}</span>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

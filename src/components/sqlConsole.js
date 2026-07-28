/**
 * SPECTOR V2 - Interactive SQL Console Component
 */

export function renderSQLConsole(containerEl, state, callbacks) {
  if (!state.sqlActive) {
    containerEl.innerHTML = '';
    return;
  }

  containerEl.innerHTML = `
    <div class="sql-panel flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-indigo-400 font-mono">⚡ SQL Query Console (DuckDB Engine)</span>
        <span class="text-xs text-muted">Example: SELECT * FROM dataset WHERE length(instruction) > 100 ORDER BY id DESC</span>
      </div>

      <div class="flex items-center gap-2">
        <textarea id="sqlInput" class="sql-editor flex-1" placeholder="Enter SQL query (e.g. SELECT * FROM dataset WHERE score > 0.8)...">${state.sqlQuery || ''}</textarea>
        <button id="btnRunSQL" class="btn btn-primary h-full px-4">
          <span>Run Query</span>
        </button>
        <button id="btnClearSQL" class="btn btn-ghost h-full">Reset</button>
      </div>
    </div>
  `;

  containerEl.querySelector('#btnRunSQL')?.addEventListener('click', () => {
    const query = containerEl.querySelector('#sqlInput').value;
    callbacks.onRunSQL(query);
  });

  containerEl.querySelector('#btnClearSQL')?.addEventListener('click', () => {
    callbacks.onRunSQL('');
  });
}

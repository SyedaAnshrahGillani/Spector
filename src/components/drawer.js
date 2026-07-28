/**
 * SPECTOR V2 - JSON Record Inspector Drawer Component
 */

export function renderDrawer(containerEl, state, callbacks) {
  const isOpen = state.showDrawer;
  const record = state.selectedRecord;
  const recordIdx = state.selectedRecordIdx;

  containerEl.innerHTML = `
    <div class="json-drawer ${isOpen ? 'active' : ''}">
      <div class="drawer-header flex items-center justify-between">
        <div>
          <span class="text-base font-bold">Record #${(recordIdx ?? 0) + 1} Inspector</span>
        </div>
        <button id="btnCloseDrawer" class="btn btn-ghost text-lg">✕</button>
      </div>

      <div class="drawer-body font-mono text-xs">
        ${record ? `<pre style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(JSON.stringify(record, null, 2))}</pre>` : '<div class="text-muted">No record selected</div>'}
      </div>
    </div>
  `;

  containerEl.querySelector('#btnCloseDrawer')?.addEventListener('click', callbacks.onCloseDrawer);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

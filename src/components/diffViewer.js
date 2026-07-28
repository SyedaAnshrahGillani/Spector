/**
 * SPECTOR V2 - Side-by-Side Prompt/Response Diff Viewer Component
 */

export function renderDiffViewer(containerEl, state, callbacks) {
  if (!state.showDiffViewer) {
    containerEl.innerHTML = '';
    return;
  }

  const records = state.records || [];
  const selectedIdx = state.diffRecordIdx || 0;
  const currentRec = records[selectedIdx] || {};

  const keys = Object.keys(currentRec);
  const leftKey = state.diffLeftKey || keys[0] || '';
  const rightKey = state.diffRightKey || keys[1] || keys[0] || '';

  const leftText = String(currentRec[leftKey] ?? '');
  const rightText = String(currentRec[rightKey] ?? '');

  containerEl.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-card" style="max-width: 1000px; height: 80vh;">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-subtle bg-header">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">⚡ Side-by-Side LLM Field Comparison</span>
            <span class="badge badge-indigo">Record #${selectedIdx + 1} of ${records.length}</span>
          </div>

          <div class="flex items-center gap-2">
            <button id="btnPrevDiff" class="btn btn-ghost text-xs" ${selectedIdx <= 0 ? 'disabled' : ''}>◀ Prev Record</button>
            <button id="btnNextDiff" class="btn btn-ghost text-xs" ${selectedIdx >= records.length - 1 ? 'disabled' : ''}>Next Record ▶</button>
            <button id="btnCloseDiff" class="btn btn-ghost text-lg">✕</button>
          </div>
        </div>

        <!-- Select Column Pairs -->
        <div class="flex items-center gap-4 p-3 bg-surface border-b border-subtle text-xs">
          <div class="flex items-center gap-2 flex-1">
            <span class="text-muted font-semibold">Left Field (Model A / Prompt):</span>
            <select id="selectLeftKey" class="input-text flex-1">
              ${keys.map(k => `<option value="${k}" ${k === leftKey ? 'selected' : ''}>${k}</option>`).join('')}
            </select>
          </div>

          <div class="flex items-center gap-2 flex-1">
            <span class="text-muted font-semibold">Right Field (Model B / Response):</span>
            <select id="selectRightKey" class="input-text flex-1">
              ${keys.map(k => `<option value="${k}" ${k === rightKey ? 'selected' : ''}>${k}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Side by Side Pane -->
        <div class="diff-container flex-1 overflow-auto">
          <div class="diff-pane">
            <div class="diff-header flex items-center justify-between">
              <span>${leftKey}</span>
              <span class="text-xs font-mono text-muted">${leftText.length} chars</span>
            </div>
            <div class="diff-content">${escapeHtml(leftText)}</div>
          </div>

          <div class="diff-pane">
            <div class="diff-header flex items-center justify-between">
              <span>${rightKey}</span>
              <span class="text-xs font-mono text-muted">${rightText.length} chars</span>
            </div>
            <div class="diff-content">${escapeHtml(rightText)}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.querySelector('#btnCloseDiff')?.addEventListener('click', callbacks.onCloseDiff);
  containerEl.querySelector('#btnPrevDiff')?.addEventListener('click', () => callbacks.onChangeDiffRecord(selectedIdx - 1));
  containerEl.querySelector('#btnNextDiff')?.addEventListener('click', () => callbacks.onChangeDiffRecord(selectedIdx + 1));

  containerEl.querySelector('#selectLeftKey')?.addEventListener('change', (e) => {
    callbacks.onChangeDiffKeys(e.target.value, rightKey);
  });
  containerEl.querySelector('#selectRightKey')?.addEventListener('change', (e) => {
    callbacks.onChangeDiffKeys(leftKey, e.target.value);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

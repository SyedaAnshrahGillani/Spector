/**
 * SPECTOR V2 - PII Masking & Privacy Guard Modal Component
 */

export function renderPiiModal(containerEl, state, callbacks) {
  if (!state.showPiiModal) {
    containerEl.innerHTML = '';
    return;
  }

  containerEl.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-card" style="max-width: 550px;">
        <div class="flex items-center justify-between p-4 border-b border-subtle bg-header">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">🛡️ Client-Side PII Privacy Guard</span>
            <span class="badge badge-emerald">100% Offline Redaction</span>
          </div>
          <button id="btnClosePii" class="btn btn-ghost text-lg">✕</button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-sm">
          <p class="text-secondary">
            Instantly redact personal identifiable information (PII) across all loaded fields before sharing datasets:
          </p>

          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="chkEmail" checked />
              <span>Redact Email Addresses (<span class="font-mono text-xs text-muted">user@example.com</span>)</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="chkIP" checked />
              <span>Redact IP Addresses (<span class="font-mono text-xs text-muted">192.168.1.1</span>)</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="chkApiToken" checked />
              <span>Redact Secret API Keys & Bearer Tokens (<span class="font-mono text-xs text-muted">sk-... / ghp_...</span>)</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="chkCreditCard" checked />
              <span>Redact Credit Card Numbers</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="chkSSN" checked />
              <span>Redact Social Security Numbers (SSN)</span>
            </label>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button id="btnCancelPii" class="btn btn-ghost">Cancel</button>
            <button id="btnApplyPii" class="btn btn-primary">
              <span>Apply Local Redaction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.querySelector('#btnClosePii')?.addEventListener('click', callbacks.onClosePii);
  containerEl.querySelector('#btnCancelPii')?.addEventListener('click', callbacks.onClosePii);

  containerEl.querySelector('#btnApplyPii')?.addEventListener('click', () => {
    const opts = {
      email: containerEl.querySelector('#chkEmail').checked,
      ip: containerEl.querySelector('#chkIP').checked,
      apiToken: containerEl.querySelector('#chkApiToken').checked,
      creditCard: containerEl.querySelector('#chkCreditCard').checked,
      ssn: containerEl.querySelector('#chkSSN').checked,
    };
    callbacks.onApplyPii(opts);
  });
}

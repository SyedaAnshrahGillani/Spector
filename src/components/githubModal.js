/**
 * SPECTOR V2 STUDIO - Direct GitHub Sync Modal Component
 */

export function renderGitHubModal(containerEl, state, callbacks) {
  if (!state.showGitHubModal) {
    containerEl.innerHTML = '';
    return;
  }

  containerEl.innerHTML = `
    <div class="modal-overlay active">
      <div class="modal-card" style="max-width: 600px;">
        <div class="flex items-center justify-between p-4 border-b border-subtle bg-header">
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold">🔗 Direct GitHub Auto-Sync</span>
            <span class="badge badge-indigo">100% Client-Side</span>
          </div>
          <button id="btnCloseGitHub" class="btn btn-ghost text-lg">✕</button>
        </div>

        <div class="p-6 flex flex-col gap-4">
          <p class="text-sm text-secondary">
            Paste any GitHub file URL or raw link to stream & inspect the dataset directly without downloading:
          </p>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted uppercase">GitHub File URL or Raw Link</label>
            <input type="text" id="githubUrlInput" class="input-text w-full font-mono text-xs" 
              placeholder="https://github.com/SyedaAnshrahGillani/Spector/blob/main/data/vibe_queries.jsonl" 
              value="${state.githubUrl || ''}" autofocus />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted uppercase">Personal Access Token (Optional for Private Repos)</label>
            <input type="password" id="githubPatInput" class="input-text w-full font-mono text-xs" 
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Optional)" 
              value="${state.githubPat || ''}" />
          </div>

          ${state.githubError ? `
            <div class="p-3 bg-red-950 border border-red-800 text-red-300 rounded text-xs">
              ⚠️ ${state.githubError}
            </div>
          ` : ''}

          <div class="flex justify-end gap-2 mt-2">
            <button id="btnCancelGitHub" class="btn btn-ghost">Cancel</button>
            <button id="btnSubmitGitHub" class="btn btn-emerald flex items-center gap-1" ${state.githubLoading ? 'disabled' : ''}>
              <span>${state.githubLoading ? '⚡ Syncing Dataset...' : 'Sync Dataset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const inputEl = containerEl.querySelector('#githubUrlInput');
  const submitBtn = containerEl.querySelector('#btnSubmitGitHub');

  const doSubmit = () => {
    const url = inputEl.value;
    const pat = containerEl.querySelector('#githubPatInput').value;
    callbacks.onSyncGitHub(url, pat);
  };

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSubmit();
  });

  containerEl.querySelector('#btnCloseGitHub')?.addEventListener('click', callbacks.onCloseGitHub);
  containerEl.querySelector('#btnCancelGitHub')?.addEventListener('click', callbacks.onCloseGitHub);
  submitBtn?.addEventListener('click', doSubmit);
}

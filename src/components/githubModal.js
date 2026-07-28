/**
 * SPECTOR V2 - Direct GitHub Sync Modal Component
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
            Paste any GitHub file URL or repository path to stream & inspect the dataset directly without manually downloading:
          </p>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold text-muted uppercase">GitHub File URL or Raw Link</label>
            <input type="text" id="githubUrlInput" class="input-text w-full font-mono text-xs" 
              placeholder="https://github.com/username/repo/blob/main/data/llm_eval.jsonl" 
              value="${state.githubUrl || ''}" />
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
              <span>${state.githubLoading ? 'Syncing...' : 'Sync Dataset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  containerEl.querySelector('#btnCloseGitHub')?.addEventListener('click', callbacks.onCloseGitHub);
  containerEl.querySelector('#btnCancelGitHub')?.addEventListener('click', callbacks.onCloseGitHub);

  containerEl.querySelector('#btnSubmitGitHub')?.addEventListener('click', () => {
    const url = containerEl.querySelector('#githubUrlInput').value;
    const pat = containerEl.querySelector('#githubPatInput').value;
    callbacks.onSyncGitHub(url, pat);
  });
}

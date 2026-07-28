/**
 * SPECTOR V2 - Header Component with Generated Branding Logo
 */

export function renderHeader(containerEl, state, callbacks) {
  const hasData = state.records && state.records.length > 0;

  containerEl.innerHTML = `
    <header class="app-header flex items-center justify-between">
      <div id="brandLogo" class="brand-logo-container cursor-pointer hover:opacity-90 transition-opacity" title="Click to go back to Home / Reset dataset">
        <img src="src/images/spector-logo.png" alt="Spector Studio Logo" style="width:36px; height:36px; border-radius:8px; box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);" />
        <span>Spector</span>
        <span class="brand-badge">V2 STUDIO</span>
      </div>

      <div class="flex items-center gap-3">
        ${hasData ? `
          <button id="btnBackHome" class="btn btn-ghost text-sm flex items-center gap-1 text-indigo font-semibold" title="Unload dataset and return to dropzone">
            <span>🏠 Home</span>
          </button>
        ` : ''}

        <button id="btnGitHubSync" class="btn btn-ghost text-sm flex items-center gap-1" title="Sync dataset directly from GitHub repo">
          <span>🔗</span> GitHub Sync
        </button>

        <button id="btnHealthCheck" class="btn btn-ghost text-sm flex items-center gap-1" title="View dataset health & summary stats" ${!hasData ? 'disabled' : ''}>
          <span>📊</span> Health Check
        </button>

        <button id="btnDiffViewer" class="btn btn-ghost text-sm flex items-center gap-1" title="Side-by-side prompt/completion diff" ${!hasData ? 'disabled' : ''}>
          <span>⚡</span> Side-by-Side Diff
        </button>

        <button id="btnPiiMasker" class="btn btn-ghost text-sm flex items-center gap-1" title="Redact sensitive user data" ${!hasData ? 'disabled' : ''}>
          <span>🛡️</span> Redact PII
        </button>

        <button id="themeToggle" class="btn btn-ghost" title="Toggle Light / Obsidian Dark Theme">
          <span id="themeIcon">${state.theme === 'dark' ? '🌙' : '☀️'}</span>
        </button>

        <a href="https://github.com/SyedaAnshrahGillani/Spector" target="_blank" class="btn btn-primary text-sm flex items-center gap-1">
          <span>⭐ Star on GitHub</span>
        </a>
      </div>
    </header>
  `;

  // Attach event listeners
  containerEl.querySelector('#brandLogo')?.addEventListener('click', callbacks.onResetHome);
  containerEl.querySelector('#btnBackHome')?.addEventListener('click', callbacks.onResetHome);
  containerEl.querySelector('#themeToggle')?.addEventListener('click', callbacks.onToggleTheme);
  containerEl.querySelector('#btnGitHubSync')?.addEventListener('click', callbacks.onOpenGitHubSync);
  containerEl.querySelector('#btnHealthCheck')?.addEventListener('click', callbacks.onOpenHealthCheck);
  containerEl.querySelector('#btnDiffViewer')?.addEventListener('click', callbacks.onOpenDiffViewer);
  containerEl.querySelector('#btnPiiMasker')?.addEventListener('click', callbacks.onOpenPiiMasker);
}

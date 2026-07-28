/**
 * SPECTOR V2 - Header Component
 */

export function renderHeader(containerEl, state, callbacks) {
  containerEl.innerHTML = `
    <header class="app-header flex items-center justify-between">
      <div class="brand-logo-container">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#brand-grad)"/>
          <path d="M10 12C10 10.8954 10.8954 10 12 10H20C21.1046 10 22 10.8954 22 12V20C22 21.1046 21.1046 22 20 22H12C10.8954 22 10 21.1046 10 20V12Z" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="16" cy="16" r="3" fill="#6366F1"/>
          <defs>
            <linearGradient id="brand-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#4F46E5"/>
              <stop offset="1" stop-color="#10B981"/>
            </linearGradient>
          </defs>
        </svg>
        <span>Spector</span>
        <span class="brand-badge">V2 STUDIO</span>
      </div>

      <div class="flex items-center gap-3">
        <button id="btnGitHubSync" class="btn btn-ghost text-sm flex items-center gap-1" title="Sync dataset directly from GitHub repo">
          <span>🔗</span> GitHub Sync
        </button>

        <button id="btnHealthCheck" class="btn btn-ghost text-sm flex items-center gap-1" title="View dataset health & summary stats" ${!state.records || state.records.length === 0 ? 'disabled' : ''}>
          <span>📊</span> Health Check
        </button>

        <button id="btnDiffViewer" class="btn btn-ghost text-sm flex items-center gap-1" title="Side-by-side prompt/completion diff" ${!state.records || state.records.length === 0 ? 'disabled' : ''}>
          <span>⚡</span> Side-by-Side Diff
        </button>

        <button id="btnPiiMasker" class="btn btn-ghost text-sm flex items-center gap-1" title="Redact sensitive user data" ${!state.records || state.records.length === 0 ? 'disabled' : ''}>
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
  containerEl.querySelector('#themeToggle')?.addEventListener('click', callbacks.onToggleTheme);
  containerEl.querySelector('#btnGitHubSync')?.addEventListener('click', callbacks.onOpenGitHubSync);
  containerEl.querySelector('#btnHealthCheck')?.addEventListener('click', callbacks.onOpenHealthCheck);
  containerEl.querySelector('#btnDiffViewer')?.addEventListener('click', callbacks.onOpenDiffViewer);
  containerEl.querySelector('#btnPiiMasker')?.addEventListener('click', callbacks.onOpenPiiMasker);
}

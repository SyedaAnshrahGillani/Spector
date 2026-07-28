/**
 * SPECTOR V2 - DropZone & Initial Load Hero Component
 */

export function renderDropZone(containerEl, callbacks) {
  containerEl.innerHTML = `
    <div class="flex flex-col items-center justify-center flex-1 p-6 text-center">
      <div id="dropZone" class="hero-dropzone flex flex-col items-center justify-center">
        <div class="dropzone-icon flex items-center justify-center">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Drop your dataset here to inspect instantly</h2>
        <p class="text-secondary text-sm mb-4">Supports <span class="font-mono text-indigo-400">JSON</span>, <span class="font-mono text-indigo-400">JSONL</span>, <span class="font-mono text-indigo-400">CSV</span>, and <span class="font-mono text-indigo-400">TSV</span> formats. 100% Private & Offline-first.</p>
        
        <div class="flex items-center gap-3">
          <label class="btn btn-primary cursor-pointer">
            <span>📂 Browse Local File</span>
            <input type="file" id="fileInput" accept=".json,.jsonl,.csv,.tsv" class="hidden" style="display:none" />
          </label>
          <button id="btnHeroGitHub" class="btn btn-emerald">
            <span>🔗 Sync from GitHub</span>
          </button>
        </div>
      </div>

      <div class="mt-6 flex flex-col items-center gap-2">
        <span class="text-xs text-muted uppercase tracking-wider font-semibold">Or try sample LLM datasets</span>
        <div class="flex flex-wrap justify-center gap-2 mt-1">
          <button class="btn btn-ghost text-xs sample-btn" data-sample="llm_eval.jsonl">🤖 LLM Evaluation Dataset (.jsonl)</button>
          <button class="btn btn-ghost text-xs sample-btn" data-sample="llm_qa.json">❓ Prompt & Q&A Pairs (.json)</button>
          <button class="btn btn-ghost text-xs sample-btn" data-sample="vibe_queries.jsonl">🎨 UI Vibe Queries (.jsonl)</button>
        </div>
      </div>
    </div>
  `;

  const dropZone = containerEl.querySelector('#dropZone');
  const fileInput = containerEl.querySelector('#fileInput');

  // Drag & drop handlers
  ['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      callbacks.onFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      callbacks.onFileSelected(e.target.files[0]);
    }
  });

  containerEl.querySelector('#btnHeroGitHub')?.addEventListener('click', callbacks.onOpenGitHubSync);

  // Sample dataset buttons
  containerEl.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleName = btn.getAttribute('data-sample');
      callbacks.onLoadSample(sampleName);
    });
  });
}

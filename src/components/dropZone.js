/**
 * SPECTOR V2 - DropZone & Initial Load Hero Component
 */

export function renderDropZone(containerEl, callbacks) {
  containerEl.innerHTML = `
    <div class="flex flex-col items-center justify-center flex-1 p-6 text-center animate-fade-in">
      <div id="dropZone" class="hero-dropzone flex flex-col items-center justify-center">
        <div class="dropzone-icon flex items-center justify-center">
          <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2 tracking-tight">Inspect your datasets privately & instantly</h2>
        <p class="text-secondary text-sm mb-6 max-w-lg">Supports <span class="font-mono text-indigo font-semibold">JSON</span>, <span class="font-mono text-indigo font-semibold">JSONL</span>, <span class="font-mono text-indigo font-semibold">CSV</span>, and <span class="font-mono text-indigo font-semibold">TSV</span>. 100% Private, Client-Side processing with Zero Server Uploads.</p>
        
        <div class="flex items-center gap-3">
          <label class="btn btn-primary cursor-pointer px-5 py-2.5 text-base">
            <span>📂 Browse Local File</span>
            <input type="file" id="fileInput" accept=".json,.jsonl,.csv,.tsv" style="display:none" />
          </label>
          <button id="btnHeroGitHub" class="btn btn-emerald px-5 py-2.5 text-base">
            <span>🔗 Sync from GitHub</span>
          </button>
        </div>
      </div>

      <div class="mt-8 flex flex-col items-center gap-3">
        <span class="text-xs text-muted uppercase tracking-widest font-bold">Or load sample datasets for instant demo</span>
        <div class="flex flex-wrap justify-center gap-2.5">
          <button class="btn btn-ghost text-xs sample-btn badge-indigo" data-sample="llm_benchmark.json">🚀 LLM Model Benchmark (.json)</button>
          <button class="btn btn-ghost text-xs sample-btn" data-sample="llm_eval.jsonl">🤖 LLM Pair Evaluation (.jsonl)</button>
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

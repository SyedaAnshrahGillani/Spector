/**
 * SPECTOR V2 - Application Core State & Bootstrapper
 */

import { DataParser } from './engine/dataParser.js';
import { SQLEngine } from './engine/sqlEngine.js';
import { GitHubSync } from './engine/githubSync.js';
import { PIIMasker } from './engine/piiMasker.js';

import { renderHeader } from './components/header.js';
import { renderDropZone } from './components/dropZone.js';
import { renderTableView } from './components/tableView.js';
import { renderSQLConsole } from './components/sqlConsole.js';
import { renderDiffViewer } from './components/diffViewer.js';
import { renderHealthDashboard } from './components/healthDashboard.js';
import { renderDrawer } from './components/drawer.js';
import { renderGitHubModal } from './components/githubModal.js';
import { renderPiiModal } from './components/piiModal.js';

class SpectorApp {
  constructor() {
    this.state = {
      theme: localStorage.getItem('spector_theme') || 'dark',
      records: null,
      filteredRecords: null,
      fileName: '',
      currentPage: 1,
      pageSize: 25,
      searchQuery: '',
      sortCol: null,
      sortDir: 'asc',

      // Modals & Panels
      sqlActive: false,
      sqlQuery: '',
      showDrawer: false,
      selectedRecord: null,
      selectedRecordIdx: null,

      showDiffViewer: false,
      diffRecordIdx: 0,
      diffLeftKey: '',
      diffRightKey: '',

      showHealthCheck: false,
      showGitHubModal: false,
      githubUrl: '',
      githubPat: '',
      githubLoading: false,
      githubError: '',

      showPiiModal: false,
    };

    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.render();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  resetHome() {
    this.setState({
      records: null,
      filteredRecords: null,
      fileName: '',
      currentPage: 1,
      searchQuery: '',
      sortCol: null,
      sqlActive: false,
      sqlQuery: '',
      showDrawer: false,
      showDiffViewer: false,
      showHealthCheck: false,
      showGitHubModal: false,
      showPiiModal: false,
    });
  }

  render() {
    const rootEl = document.getElementById('app');
    if (!rootEl) return;

    // Header container
    let headerEl = rootEl.querySelector('#headerContainer');
    if (!headerEl) {
      rootEl.innerHTML = `
        <div id="headerContainer"></div>
        <div id="sqlContainer"></div>
        <div id="mainWorkspace" class="workspace-container"></div>
        <div id="drawerContainer"></div>
        <div id="diffViewerContainer"></div>
        <div id="healthCheckContainer"></div>
        <div id="githubModalContainer"></div>
        <div id="piiModalContainer"></div>
      `;
      headerEl = rootEl.querySelector('#headerContainer');
    }

    // Render Header
    renderHeader(headerEl, this.state, {
      onResetHome: () => this.resetHome(),
      onToggleTheme: () => {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('spector_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        this.setState({ theme: newTheme });
      },
      onOpenGitHubSync: () => this.setState({ showGitHubModal: true, githubError: '' }),
      onOpenHealthCheck: () => this.setState({ showHealthCheck: true }),
      onOpenDiffViewer: () => this.setState({ showDiffViewer: true, diffRecordIdx: 0 }),
      onOpenPiiMasker: () => this.setState({ showPiiModal: true }),
    });

    // Render SQL Console
    const sqlEl = rootEl.querySelector('#sqlContainer');
    renderSQLConsole(sqlEl, this.state, {
      onRunSQL: (query) => {
        const filtered = SQLEngine.query(this.state.records, query);
        this.setState({ sqlQuery: query, filteredRecords: filtered, currentPage: 1 });
      }
    });

    // Render Main Workspace (Dropzone vs Table)
    const mainEl = rootEl.querySelector('#mainWorkspace');
    if (!this.state.records || this.state.records.length === 0) {
      renderDropZone(mainEl, {
        onFileSelected: (file) => this.loadFile(file),
        onOpenGitHubSync: () => this.setState({ showGitHubModal: true, githubError: '' }),
        onLoadSample: (sampleName) => this.loadSample(sampleName),
      });
    } else {
      renderTableView(mainEl, this.state, {
        onSearch: (q) => this.handleSearch(q),
        onPageChange: (p) => this.setState({ currentPage: p }),
        onPageSizeChange: (s) => this.setState({ pageSize: s, currentPage: 1 }),
        onSort: (col) => this.handleSort(col),
        onToggleSQL: () => this.setState({ sqlActive: !this.state.sqlActive }),
        onRowClick: (record, idx) => this.setState({ showDrawer: true, selectedRecord: record, selectedRecordIdx: idx }),
        onExport: (format) => this.exportDataset(format),
      });
    }

    // Render Modals & Drawers
    renderDrawer(rootEl.querySelector('#drawerContainer'), this.state, {
      onCloseDrawer: () => this.setState({ showDrawer: false })
    });

    renderDiffViewer(rootEl.querySelector('#diffViewerContainer'), this.state, {
      onCloseDiff: () => this.setState({ showDiffViewer: false }),
      onChangeDiffRecord: (idx) => this.setState({ diffRecordIdx: idx }),
      onChangeDiffKeys: (l, r) => this.setState({ diffLeftKey: l, diffRightKey: r }),
    });

    renderHealthDashboard(rootEl.querySelector('#healthCheckContainer'), this.state, {
      onCloseHealth: () => this.setState({ showHealthCheck: false })
    });

    renderGitHubModal(rootEl.querySelector('#githubModalContainer'), this.state, {
      onCloseGitHub: () => this.setState({ showGitHubModal: false }),
      onSyncGitHub: (url, pat) => this.syncFromGitHub(url, pat),
    });

    renderPiiModal(rootEl.querySelector('#piiModalContainer'), this.state, {
      onClosePii: () => this.setState({ showPiiModal: false }),
      onApplyPii: (opts) => this.applyPiiMasking(opts),
    });
  }

  async loadFile(file) {
    try {
      const text = await file.text();
      const records = DataParser.parse(text, file.name);
      this.setState({
        records,
        filteredRecords: records,
        fileName: file.name,
        currentPage: 1,
        searchQuery: ''
      });
    } catch (err) {
      alert(`Error loading file: ${err.message}`);
    }
  }

  async loadSample(sampleName) {
    try {
      const res = await fetch(`data/${sampleName}`);
      if (!res.ok) throw new Error(`Could not load sample data/${sampleName}`);
      const text = await res.text();
      const records = DataParser.parse(text, sampleName);
      this.setState({
        records,
        filteredRecords: records,
        fileName: sampleName,
        currentPage: 1,
        searchQuery: ''
      });
    } catch (err) {
      alert(`Failed loading sample: ${err.message}`);
    }
  }

  async syncFromGitHub(url, pat) {
    if (!url || !url.trim()) return;
    this.setState({ githubLoading: true, githubError: '' });

    try {
      const res = await GitHubSync.fetchFromGitHub(url, pat);
      this.setState({
        records: res.records,
        filteredRecords: res.records,
        fileName: res.fileName,
        currentPage: 1,
        showGitHubModal: false,
        githubLoading: false
      });
    } catch (err) {
      this.setState({ githubError: err.message, githubLoading: false });
    }
  }

  handleSearch(q) {
    const query = q.toLowerCase().trim();
    if (!query) {
      this.setState({ searchQuery: q, filteredRecords: this.state.records, currentPage: 1 });
      return;
    }

    const filtered = (this.state.records || []).filter(rec => {
      return Object.values(rec).some(v => String(v).toLowerCase().includes(query));
    });
    this.setState({ searchQuery: q, filteredRecords: filtered, currentPage: 1 });
  }

  handleSort(col) {
    let dir = 'asc';
    if (this.state.sortCol === col && this.state.sortDir === 'asc') dir = 'desc';

    const records = [...(this.state.filteredRecords || [])];
    records.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    this.setState({ sortCol: col, sortDir: dir, filteredRecords: records });
  }

  applyPiiMasking(opts) {
    const masked = PIIMasker.maskDataset(this.state.records, opts);
    this.setState({
      records: masked,
      filteredRecords: masked,
      showPiiModal: false
    });
  }

  exportDataset(format) {
    const records = this.state.filteredRecords || this.state.records || [];
    let blobContent = '';
    let mimeType = 'text/plain';

    if (format === 'jsonl') {
      blobContent = records.map(r => JSON.stringify(r)).join('\n');
      mimeType = 'application/x-jsonlines';
    } else {
      // CSV Export
      const cols = DataParser.extractColumns(records);
      const rows = [cols.join(',')];
      records.forEach(r => {
        const line = cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',');
        rows.push(line);
      });
      blobContent = rows.join('\n');
      mimeType = 'text/csv';
    }

    const blob = new Blob([blobContent], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `spector_export_${Date.now()}.${format}`;
    link.click();
  }
}

// Instantiate App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.spectorApp = new SpectorApp();
});

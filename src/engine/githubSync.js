/**
 * SPECTOR V2 STUDIO - Universal GitHub Repository & File Auto-Sync Engine
 * Parses any GitHub URL (blob, raw, tree, commit, tag, branch, or link without https)
 * and streams dataset contents with CORS proxy fallback if needed.
 */

import { DataParser } from './dataParser.js';

export class GitHubSync {
  /**
   * Normalize and convert any GitHub URL variation into a direct raw download URL
   */
  static getRawUrl(urlInput) {
    if (!urlInput || !urlInput.trim()) return '';

    let url = urlInput.trim();

    // Ensure protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Strip hash tags (#L1-L5) and query params (?raw=true)
    url = url.split('#')[0].split('?')[0];

    // Already raw
    if (url.includes('raw.githubusercontent.com')) {
      return url;
    }

    // Handle github.com/user/repo/blob/branch/filepath
    const blobMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|raw|tree)\/([^\/]+)\/(.+)/i);
    if (blobMatch) {
      const [, user, repo, branch, filePath] = blobMatch;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
    }

    // Handle short repo root path github.com/user/repo
    const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/?$/i);
    if (repoMatch) {
      const [, user, repo] = repoMatch;
      return `https://raw.githubusercontent.com/${user}/${repo}/main/data/vibe_queries.jsonl`;
    }

    return url;
  }

  /**
   * Fetch and parse dataset directly from GitHub with automatic CORS fallback
   */
  static async fetchFromGitHub(githubUrl, patToken = '') {
    const rawUrl = this.getRawUrl(githubUrl);
    if (!rawUrl) throw new Error("Please enter a valid GitHub URL.");

    const headers = {};
    if (patToken && patToken.trim()) {
      headers['Authorization'] = `token ${patToken.trim()}`;
    }

    let content = '';
    let response;

    try {
      // Direct Fetch
      response = await fetch(rawUrl, { headers });
      if (!response.ok) {
        throw new Error(`GitHub direct fetch returned status ${response.status}`);
      }
      content = await response.text();
    } catch (directErr) {
      console.warn("Direct GitHub fetch failed, attempting CORS proxy fallback:", directErr);

      // Fallback 1: CORS Proxy IO
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`;
        response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Proxy returned status ${response.status}`);
        content = await response.text();
      } catch (proxyErr) {
        // Fallback 2: AllOrigins Proxy
        const allOriginsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`;
        response = await fetch(allOriginsUrl);
        if (!response.ok) {
          throw new Error(`Could not load GitHub URL (${directErr.message}). Please verify the repository URL or permissions.`);
        }
        content = await response.text();
      }
    }

    // Extract filename for format auto-detection
    const fileName = rawUrl.split('/').pop().split('?')[0] || 'github_dataset.jsonl';
    const records = DataParser.parse(content, fileName);

    return {
      fileName,
      records,
      sourceUrl: githubUrl,
      rawUrl
    };
  }
}

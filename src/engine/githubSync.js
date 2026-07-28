/**
 * SPECTOR V2 - Direct GitHub Repository & File Sync Engine
 * Allows users to paste any GitHub file URL or repo path, auto-sync and load datasets instantly.
 */

import { DataParser } from './dataParser.js';

export class GitHubSync {
  /**
   * Converts any GitHub URL (e.g. github.com/user/repo/blob/main/data.jsonl) to raw download URL
   */
  static getRawUrl(urlInput) {
    let url = urlInput.trim();

    // Already a raw github url
    if (url.includes('raw.githubusercontent.com')) {
      return url;
    }

    // Convert github.com/user/repo/blob/branch/path -> raw.githubusercontent.com/user/repo/branch/path
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
    if (match) {
      const [, user, repo, branch, filePath] = match;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
    }

    // Convert github.com/user/repo/raw/branch/path
    const rawMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/raw\/([^\/]+)\/(.+)/);
    if (rawMatch) {
      const [, user, repo, branch, filePath] = rawMatch;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
    }

    return url;
  }

  /**
   * Fetch and parse a dataset directly from GitHub
   */
  static async fetchFromGitHub(githubUrl, patToken = '') {
    const rawUrl = this.getRawUrl(githubUrl);
    const headers = {};

    if (patToken && patToken.trim()) {
      headers['Authorization'] = `token ${patToken.trim()}`;
    }

    const response = await fetch(rawUrl, { headers });
    if (!response.ok) {
      throw new Error(`GitHub fetch failed (${response.status} ${response.statusText}). Check repo visibility or token.`);
    }

    const content = await response.text();
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

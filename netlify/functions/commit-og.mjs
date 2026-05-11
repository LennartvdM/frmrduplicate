// Commits the uploaded PNG to frankenstein/public/og-preview.png in the repo
// via the GitHub Contents API. The resulting commit triggers Netlify's normal
// redeploy, so the new OG image goes live on the next build.
//
// Required Netlify env vars:
//   GITHUB_TOKEN   fine-grained PAT with "Contents: write" on the target repo
//   UPLOAD_SECRET  shared secret the page sends with each request
// Optional:
//   GITHUB_REPO    default "LennartvdM/frmrduplicate"
//   GITHUB_BRANCH  default "main"
//   OG_TARGET_PATH default "frankenstein/public/og-preview.png"

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'invalid JSON' }); }

  const { image, secret } = body;
  if (!image || typeof image !== 'string') return json(400, { error: 'missing image' });

  const expected = process.env.UPLOAD_SECRET;
  if (!expected || secret !== expected) return json(401, { error: 'bad secret' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return json(500, { error: 'GITHUB_TOKEN not configured' });

  const repo = process.env.GITHUB_REPO || 'LennartvdM/frmrduplicate';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const targetPath = process.env.OG_TARGET_PATH || 'frankenstein/public/og-preview.png';
  const api = `https://api.github.com/repos/${repo}/contents/${targetPath}`;

  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'neoflix-og-upload',
    Accept: 'application/vnd.github+json',
  };

  let sha;
  const getRes = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders });
  if (getRes.ok) {
    const data = await getRes.json();
    sha = data.sha;
  } else if (getRes.status !== 404) {
    return json(502, { error: `GitHub GET ${getRes.status}`, detail: await getRes.text() });
  }

  const putRes = await fetch(api, {
    method: 'PUT',
    headers: { ...ghHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update og-preview.png via upload page',
      content: image,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    return json(502, { error: `GitHub PUT ${putRes.status}`, detail: await putRes.text() });
  }

  const data = await putRes.json();
  return json(200, {
    ok: true,
    commit: data.commit && data.commit.html_url,
    sha: data.content && data.content.sha,
  });
};

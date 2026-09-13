// Retour de GitHub : on échange le code contre un jeton, puis on le repasse à
// Decap par postMessage — la fenêtre surgissante se referme ensuite seule.
export default async function handler(request, response) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const { code } = request.query;

  const send = (status, content) =>
    response.status(status).setHeader('Content-Type', 'text/html; charset=utf-8').send(content);

  if (!clientId || !clientSecret) {
    return send(500, 'OAUTH_CLIENT_ID ou OAUTH_CLIENT_SECRET manquant côté Vercel.');
  }

  if (!code) {
    return send(400, 'Code d’autorisation absent.');
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
      return send(401, `GitHub a refusé l’échange : ${data.error_description ?? data.error}`);
    }

    // Decap attend très précisément ce format de message.
    const payload = JSON.stringify({ token: data.access_token, provider: 'github' });

    return send(
      200,
      `<!doctype html><meta charset="utf-8"><title>Connexion…</title>
<script>
  (function () {
    function post(event) {
      if (!event.data || event.data !== 'authorizing:github') return;
      window.removeEventListener('message', post, false);
      window.opener.postMessage('authorization:github:success:${payload}', event.origin);
    }
    window.addEventListener('message', post, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Connexion établie, cette fenêtre va se fermer.</p>`
    );
  } catch (error) {
    return send(500, `Échec de l’échange du jeton : ${error.message}`);
  }
}

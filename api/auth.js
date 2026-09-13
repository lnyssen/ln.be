// Début du parcours OAuth : on envoie l'éditeur chez GitHub.
// Decap appelle cette adresse quand on clique « Login with GitHub ».
export default function handler(request, response) {
  const clientId = process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    return response
      .status(500)
      .send("OAUTH_CLIENT_ID manquant dans les variables d'environnement Vercel.");
  }

  const host = request.headers['x-forwarded-host'] ?? request.headers.host;
  const proto = request.headers['x-forwarded-proto'] ?? 'https';

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${proto}://${host}/api/callback`);
  // `repo` est nécessaire : le dépôt est privé.
  url.searchParams.set('scope', 'repo,user');

  response.redirect(302, url.toString());
}

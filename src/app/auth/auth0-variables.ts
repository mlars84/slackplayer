interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '7H1HvoGeliq3SpcU9LP7PfZPQmI0F2I5', 
  domain: 'mlars84.auth0.com',
  callbackURL: 'http://localhost:8100/#/callback',
  apiUrl: 'https://mlars84.auth0.com/api/v2/'
};





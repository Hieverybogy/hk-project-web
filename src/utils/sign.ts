const TokenKey = "AD-Admin-Token";

export function getToken() {
  return localStorage.getItem(TokenKey) || '111111111111111';
}

export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

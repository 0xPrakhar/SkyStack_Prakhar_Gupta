const AUTH_TOKEN_KEY = "eventify.auth.token";

<<<<<<< HEAD
<<<<<<< HEAD
export function loadAuthToken() {
=======
=======
>>>>>>> e91372e (initial commit)
function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeAuthToken(token: string) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)
  if (!canUseStorage()) {
    return;
  }

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)
  if (!canUseStorage()) {
    return;
  }

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

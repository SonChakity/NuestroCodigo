let currentUser = null;

export function signInAnonymously(name) {
  currentUser = { id: Date.now().toString(), name };
}

export function getCurrentUser() {
  return currentUser;
}

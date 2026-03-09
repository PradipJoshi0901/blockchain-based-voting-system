// authStore.js
const crypto = require("crypto");

const sessions = new Map(); // voterId -> { nonce, address, used }

function generateNonce(voterId, registeredAddress) {
  const nonce = "vote-login-" + crypto.randomBytes(16).toString("hex");
  sessions.set(voterId, {
    nonce,
    address: registeredAddress.toLowerCase(),
    used: false,
  });
  return nonce;
}

function getSession(voterId) {
  return sessions.get(voterId);
}

function markUsed(voterId) {
  const s = sessions.get(voterId);
  if (s) {
    s.used = true;
    sessions.set(voterId, s);
  }
}

module.exports = { generateNonce, getSession, markUsed };

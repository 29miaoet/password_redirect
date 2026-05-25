//===========================================================================================================================================//
const encryptedHex =
  "88121a3d2bbb1b300f8e68322e42b5403c5646e83d6788be0bd4c39c57d8c0f26e31110e662b1b27dc33a151d6e0593da6269bbe9706b37c5358";
const saltHex = "755c5e704ed074378c594768bf83dcfa";
const ivHex = "a16e49c3ba6bb39dd117b45c";
//===========================================================================================================================================//

function hexToUint8Array(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2)
    bytes.push(parseInt(hex.substr(i, 2), 16));
  return new Uint8Array(bytes);
}

const encryptedData = hexToUint8Array(encryptedHex);
const salt = hexToUint8Array(saltHex);
const iv = hexToUint8Array(ivHex);

let maxRetries = 3;
let attemptCount = 0;

async function deriveKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 150000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
}

async function unlock() {
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error");
  const retryMessageElement = document.getElementById("retryMessage");
  const continueBtn = document.getElementById("continueBtn");

  errorElement.style.display = "none";
  retryMessageElement.textContent = "";

  try {
    const key = await deriveKey(password);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData,
    );
    const url = new TextDecoder().decode(decryptedBuffer);
    window.location.href = url;
  } catch (e) {
    attemptCount++;
    errorElement.style.display = "block";

    if (attemptCount >= maxRetries) {
      continueBtn.disabled = true;
      retryMessageElement.textContent =
        "Maximum attempts reached. Please try again later.";
    } else {
      retryMessageElement.textContent = `${maxRetries - attemptCount} attempts remaining.`;
    }
  }
}

document.getElementById("password").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !document.getElementById("continueBtn").disabled) {
    unlock();
  }
});

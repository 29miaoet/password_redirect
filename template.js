// Notice: Values that require changing are marked with <>
// Replace the values below with the ones calculated
//===========================================================================================================================================//
const encryptedHex = "<ENCRYPTED_DATA>";
const saltHex = "<SALT>";
const ivHex = "<IV>";
//===========================================================================================================================================//

function hexToUint8Array(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.substr(i,2),16));
    return new Uint8Array(bytes);
}

const encryptedData = hexToUint8Array(encryptedHex);
const salt = hexToUint8Array(saltHex);
const iv = hexToUint8Array(ivHex);

// Change this if you want more or less retries:
let maxRetries = 3;
let attemptCount = 0;

// Key derivation function
async function deriveKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: 150000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );
}

// Unlock function
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
            encryptedData
        );
        const url = new TextDecoder().decode(decryptedBuffer);
        window.location.href = url;
    } catch (e) {
        attemptCount++;
        errorElement.style.display = "block";

        if (attemptCount >= maxRetries) {
            continueBtn.disabled = true;
            retryMessageElement.textContent = "Maximum attempts reached. Please try again later.";
        } else {
            retryMessageElement.textContent = `${maxRetries - attemptCount} attempts remaining.`;
        }
    }
}

// This function listens for input and submission, it will vary with different html pages.
// Please changes the relevant ids and event listeners as needed.
document.getElementById("<INPUT_FIELD_ID>")
.addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !document.getElementById("<SUBMIT_BUTTON_ID>").disabled) {
        unlock();
    }
});

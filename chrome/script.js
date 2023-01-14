import { Sha256 } from "./sha256.mjs";

const form = document.querySelector("form");
const passdiv = document.querySelector("#passdiv");

// Prevent to copy masterkey
const masterKeyField = document.querySelector("#masterkey");
masterKeyField.addEventListener('copy', (e) => {
    e.preventDefault();
})

function showPassword(password) {
    let pass = passdiv.querySelector("#pass");
    let copy = passdiv.querySelector("#copy-btn");
    if (pass != null) {
        pass.remove()
    }
    if (copy != null) {
        copy.remove()
    }

    let p = document.createElement('input');
    p.type = "text";
    p.value = password;
    p.id = "pass";
    p.disabled = "disabled";
    passdiv.appendChild(p);

    let copyBtn = document.createElement('button');
    copyBtn.innerText = "Copy password"
    copyBtn.id = "copy-btn"
    copyBtn.onclick = copyToClipboard
    passdiv.appendChild(copyBtn)
}

function copyToClipboard() {
    var copyText = document.querySelector("#pass");

    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}

function showError(err) {
    let pass = passdiv.querySelector("#pass");
    if (pass != null) {
        pass.remove()
    }

    let p = document.createElement('input');
    p.type = "text";
    p.value = err;
    p.id = "pass";
    p.disabled = "disabled";
    p.style = "color: red;";
    passdiv.appendChild(p);
}

function generatePassword(masterKey, platform, name, num) {
    let pass = masterKey.concat(platform, name, num);
    pass = Sha256.hash(pass);
    num = Math.abs(num % (64 - 15));
    pass = pass.slice(num, num + 15);
    return pass
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let masterKey = form.masterkey.value;
    let platform = form.platform.value;
    let name = form.name.value;
    let num = form.number.value;

    if (masterKey == '' || platform == '' || name == '') {
        showError("Please Enter all above");
        return;
    }

    chrome.storage.sync.set({
        "masterkey": masterKey,
        "nam": name,
        "num": num
    });

    let pass = generatePassword(masterKey, platform, name, num);
    showPassword(pass);
});

function load() {
    chrome.storage.sync.get(["masterkey", "nam", "num"], (data) => {
        if (data.masterkey != undefined) {
            document.querySelector("#masterkey").value = data.masterkey;
        }
        if (data.nam != undefined) {
            document.querySelector("#name").value = data.nam;
        }
        if (data.masterkey != undefined) {
            document.querySelector("#number").value = data["num"];
        }
    });
}

load()
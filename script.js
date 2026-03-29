// ==========================
// Carousel
// ==========================
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-next');
const prevButton = document.querySelector('.carousel-prev');
const dotsNav = document.querySelector('.carousel-dots');

let currentIndex = 0;

// crea i dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if(i === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.dataset.index = i;
    dotsNav.appendChild(dot);
});

const dots = Array.from(dotsNav.children);

function updateSlide(index){
    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    dots.forEach((dot,i)=>{
        dot.classList.toggle('is-active', i===index);
        dot.setAttribute('aria-selected', i===index ? 'true' : 'false');
    });
}

nextButton.addEventListener('click', ()=> {
    let nextIndex = currentIndex + 1 >= slides.length ? 0 : currentIndex + 1;
    updateSlide(nextIndex);
});

prevButton.addEventListener('click', ()=> {
    let prevIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
    updateSlide(prevIndex);
});

dots.forEach(dot=>{
    dot.addEventListener('click', (e)=>{
        const index = parseInt(e.target.dataset.index);
        updateSlide(index);
    });
});

// ==========================
// Modal & Contact Form
// ==========================
const openBtn = document.getElementById('openContact');
const modal = document.getElementById('contactModal');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('contactForm');
const openHeroBtn = document.getElementById('openContactHero');

function openModal(){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
}

function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
}

if(openBtn) openBtn.addEventListener('click', openModal);
if(openHeroBtn) openHeroBtn.addEventListener('click', openModal);
if(closeBtn) closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function(e){
    if(e.target===modal) closeModal();
});

document.addEventListener('keydown', function(e){
    if(e.key==='Escape') closeModal();
});

// ==========================
// Pacchetto da card
// ==========================
window.selectPackage = function(pkgValue){
    const input = document.querySelector(`input[name="pacchetto"][value="${pkgValue}"]`);
    if(input){
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    openModal();
};

document.querySelectorAll('.card-cta').forEach(btn => {
    const pkg = btn.getAttribute('data-package') || (btn.getAttribute('onclick') || '').match(/selectPackage\('(.+?)'\)/)?.[1];
    if(!pkg) return;
    const handler = function(e){ e.preventDefault(); window.selectPackage(pkg); };
    btn.addEventListener('click', handler);
    try {
        btn.addEventListener('touchend', handler, { passive: false });
    } catch (ex) {
        btn.addEventListener('touchend', handler);
    }
});

// ==========================
// EmailJS
// ==========================
const EMAILJS_USER_ID = 'F2qU7FfHmvS-C5C7J';
const EMAILJS_SERVICE_ID = 'service_7guefxe';
const EMAILJS_TEMPLATE_ID = 'template_jq9br66';

if(typeof emailjs !== 'undefined' && emailjs.init) emailjs.init(EMAILJS_USER_ID);

form.addEventListener('submit', function(e){
    e.preventDefault();

    const submitBtn = form.querySelector('.cta-submit');
    if(submitBtn) submitBtn.disabled = true;

    const committente = document.getElementById('committente').value.trim();
    const destinatario = document.getElementById('destinatario').value.trim();
    const conoscenza = document.getElementById('conoscenza').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const stileEls = Array.from(document.querySelectorAll('input[name="stile"]:checked'));
    const stile = stileEls.map(i=>i.value).join(', ') || 'Nessuno selezionato';
    const pacchettoEls = Array.from(document.querySelectorAll('input[name="pacchetto"]:checked'));
    const pacchetto = pacchettoEls.map(i=>i.value).join(', ') || 'Nessuno selezionato';

    const templateParams = {
        committente,
        destinatario,
        conoscenza,
        email,
        telefono,
        stile,
        pacchetto
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response){
            alert("Richiesta inviata con successo!");
            form.reset();
            closeModal();
            if(submitBtn) submitBtn.disabled = false;
        }, function(error){
            alert("Errore durante l'invio, riprova più tardi.");
            if(submitBtn) submitBtn.disabled = false;
        });
});
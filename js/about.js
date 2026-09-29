/* =========================================
   REPLACED CORE: THEME & MOBILE RESPONSIVE
========================================= */

const body = document.body;
const THEME_KEY = "portfolio-theme";

// Helper function to redraw Lucide Icons when layouts change
function renderIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// 1. SYSTEM THEME MANAGEMENT
const themeToggle = document.getElementById("themeToggle");

function updateThemeIcon() {
    if (!themeToggle) return;
    const isLight = body.classList.contains("light-mode");
    
    // Injects the interactive vector asset safely instead of text string symbols
    themeToggle.innerHTML = `<i data-lucide="${isLight ? "moon" : "sun"}"></i>`;
    themeToggle.setAttribute("aria-label", isLight ? "Switch to night mode" : "Switch to day mode");
    themeToggle.setAttribute("title", isLight ? "Night mode" : "Day mode");
    renderIcons();
}

if (localStorage.getItem(THEME_KEY) === "light") {
    body.classList.add("light-mode");
}
updateThemeIcon();

themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    localStorage.setItem(THEME_KEY, body.classList.contains("light-mode") ? "light" : "dark");
    updateThemeIcon();
});


// 2. INTERACTIVE MOBiLE MENU UTILITIES
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
    navLinks?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    if (menuBtn) {
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
        renderIcons();
    }
}

menuBtn?.addEventListener("click", () => {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    
    // Switches dynamically between Menu (Hamburger) and X (Close) graphics
    menuBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    renderIcons();
});

// Close listeners matching the contact interface architecture
navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
    if (navLinks?.classList.contains("open") && !navLinks.contains(event.target) && !menuBtn?.contains(event.target)) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks?.classList.contains("open")) {
        closeMenu();
        menuBtn?.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
        closeMenu();
    }
});

// Initial bootup asset compilation
renderIcons();



/* =====================================================
   PROFILE 3D TILT
===================================================== */

const profileCard =
    document.querySelector(".profile-card");


if (profileCard) {

    profileCard.addEventListener("mousemove", (event) => {

        const rect =
            profileCard.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;


        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;


        const rotateX =
            ((y - centerY) / centerY) * -4;

        const rotateY =
            ((x - centerX) / centerX) * 4;


        profileCard.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             scale(1.02)`;

    });


    profileCard.addEventListener("mouseleave", () => {

        profileCard.style.transform =
            "perspective(900px) rotateX(0) rotateY(0) scale(1)";

    });

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const animatedElements =
    document.querySelectorAll(
        ".info-card, .interest-card, .skill-category, .timeline-item, .building-card, .workflow-step"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


animatedElements.forEach((element, index) => {

    element.style.transitionDelay =
        `${index * 70}ms`;

    observer.observe(element);

});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const currentPage =
    window.location.pathname.split("/").pop();


document.querySelectorAll(".nav-links a").forEach(link => {

    const href =
        link.getAttribute("href");

    if (href === currentPage) {

        link.classList.add("active");

    }

});


/* =====================================================
   MOUSE PARALLAX BACKGROUND
===================================================== */

document.addEventListener("mousemove", (event) => {

    const x =
        (event.clientX / window.innerWidth - 0.5);

    const y =
        (event.clientY / window.innerHeight - 0.5);


    document.querySelectorAll(".glow").forEach(
        (glow, index) => {

            const movement =
                index === 0 ? 20 : -15;

            glow.style.transform =
                `translate(${x * movement}px,
                           ${y * movement}px)`;

        }
    );

});


/* =====================================================
   DYNAMIC YEAR
===================================================== */

const footer =
    document.querySelector("footer div");

if (footer) {

    footer.innerHTML =
        `© ${new Date().getFullYear()} Aadarsh Tripathi`;

}
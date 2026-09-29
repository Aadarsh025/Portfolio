/*
    ============================================================
    HOME PAGE
    ============================================================
*/

const projects = [
    {
        title: "FocusNest",
        type: "Web App",
        description:
            "A productivity web app with a Pomodoro timer, task management and productivity analytics.",
        tech: ["HTML", "CSS", "JavaScript"],
        image:
            "/assets/focus-nest.png",
        demo: "https://github.com/Aadarsh025/Focusnest",
        github: "https://github.com/Aadarsh025/Focusnest"
    },
    {
        title: "RaktSetu",
        type: "Web App",
        description:
            "A frontend platform concept designed to connect blood seekers, donors and blood banks.",
        tech: ["HTML","JavaScript", "CSS", "LocalStorage"],
        image:
            "/assets/raktsetu.png",
        demo: "https://github.com/Aadarsh025/RaktSetu",
        github: "https://github.com/Aadarsh025/RaktSetu"
    },
    {
        title: "Digital Birthday Card",
        type: "Creative Web",
        description:
            "An interactive digital birthday card with custom messages, animations and responsive design.",
        tech: ["HTML", "CSS", "JavaScript"],
        image:
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85",
        demo: "https://github.com/Aadarsh025/birthday_page",
        github: "https://github.com/Aadarsh025/birthday_page"
    },
    // {
    //     title: "Weather App",
    //     type: "Web App",
    //     description:
    //         "A weather interface designed to present location-based weather information through a simple UI.",
    //     tech: ["JavaScript", "API", "CSS"],
    //     image:
    //         "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=85",
    //     demo: "#",
    //     github: "#"
    // },
    // {
    //     title: "Task Manager",
    //     type: "Productivity",
    //     description:
    //         "A lightweight task management concept focused on organization, status and local persistence.",
    //     tech: ["HTML", "CSS", "JavaScript"],
    //     image:
    //         "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
    //     demo: "#",
    //     github: "#"
    // },
    {
        title: "Portfolio Website",
        type: "Frontend",
        description:
            "A cinematic personal portfolio combining glass UI, responsive layouts and interactive sections.",
        tech: ["HTML", "CSS", "JavaScript"],
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
        demo: "#",
        github: "#"
    }
];


/* =========================
   CREATE PROJECT CAROUSEL
========================= */

const projectCarousel = new ThreeDCarousel(
    "#projectCarousel",
    {
        items: projects,
        autoplay: true,
        autoplayDelay: 5500
    }
);

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

/* =========================
   CURRENT YEAR
========================= */
document.getElementById("currentYear").textContent =
    new Date().getFullYear();
/* =========================
   SIMPLE REVEAL ANIMATION
========================= */
const revealElements = document.querySelectorAll(
    ".hero-content, .hero-visual, .section-heading, .info-card, .quote-card"
);
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12
    }
);
revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
});
/* =========================
   PAUSE AUTOPLAY WHEN TAB
   IS NOT VISIBLE
========================= */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        projectCarousel.pauseAutoplay();
    } else {
        projectCarousel.startAutoplay();
    }
});

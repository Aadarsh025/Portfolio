
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

/* =========================================
   3. RESUME PAGE COUNT
========================================= */

const resumePages = document.querySelectorAll(".resume-page");

const pageCount = document.getElementById("pageCount");
const footerPageCount = document.getElementById("footerPageCount");

const totalPages = resumePages.length;

if (pageCount) {
    pageCount.textContent =
        `${totalPages} ${totalPages === 1 ? "Page" : "Pages"}`;
}

if (footerPageCount) {
    footerPageCount.textContent =
        `${totalPages} ${totalPages === 1 ? "page" : "pages"}`;
}


/* =========================================
   5. PRINT RESUME PREVIEW
========================================= */

const printBtn = document.getElementById("printBtn");

printBtn?.addEventListener("click", () => {
    // Make sure every page image has loaded, otherwise blank pages can print.
    const images = Array.from(resumePreview.querySelectorAll("img"));
    const pending = images.filter((img) => !img.complete);

    if (pending.length === 0) {
        window.print();
        return;
    }

    Promise.all(
        pending.map(
            (img) =>
                new Promise((resolve) => {
                    img.addEventListener("load", resolve, { once: true });
                    img.addEventListener("error", resolve, { once: true });
                })
        )
    ).then(() => window.print());
});

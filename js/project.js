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
   FEATURED PROJECT CAROUSEL
===================================================== */

const cards =
    document.querySelectorAll(".featured-card");

const dots =
    document.querySelectorAll(".dot");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");


let currentIndex = 0;



/* UPDATE CAROUSEL */

function updateCarousel() {

    cards.forEach((card, index) => {

        card.classList.remove(
            "active",
            "previous",
            "next"
        );


        if (index === currentIndex) {

            card.classList.add("active");

        }


        else if (
            index ===
            (currentIndex - 1 + cards.length)
            % cards.length
        ) {

            card.classList.add("previous");

        }


        else if (
            index ===
            (currentIndex + 1)
            % cards.length
        ) {

            card.classList.add("next");

        }

    });


    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentIndex
        );

    });

}



/* NEXT */

nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= cards.length) {

        currentIndex = 0;

    }

    updateCarousel();

});



/* PREVIOUS */

prevBtn.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex =
            cards.length - 1;

    }

    updateCarousel();

});



/* DOT NAVIGATION */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentIndex = index;

        updateCarousel();

    });

});



/* =====================================================
   PROJECT FILTER
===================================================== */

const filters =
    document.querySelectorAll(".filter");

const projectCards =
    document.querySelectorAll(".project-card");


filters.forEach(filter => {

    filter.addEventListener("click", () => {


        /* ACTIVE BUTTON */

        filters.forEach(button => {

            button.classList.remove("active");

        });

        filter.classList.add("active");


        /* SELECT CATEGORY */

        const category =
            filter.dataset.filter;


        /* FILTER PROJECTS */

        projectCards.forEach(card => {

            const cardCategory =
                card.dataset.category;


            if (
                category === "all" ||
                cardCategory === category
            ) {

                card.classList.remove("hidden");

            }

            else {

                card.classList.add("hidden");

            }

        });

    });

});



/* =====================================================
   INITIALIZE
===================================================== */

updateCarousel();
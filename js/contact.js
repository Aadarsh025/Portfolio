
/* =========================================
   CONTACT PAGE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    // =====================================
    // 1. DAY / NIGHT MODE
    // =====================================

    const themeToggle = document.getElementById("themeToggle");
    const THEME_KEY = "portfolio-theme"; // same key as the other pages

    function renderIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function readSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (error) {
            return null; // storage blocked (private mode, etc.)
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            /* ignore */
        }
    }

    // Lucide replaces <i data-lucide> with an <svg>, so the button's
    // contents are rebuilt each time instead of keeping a stale reference.
    function updateThemeIcon() {
        if (!themeToggle) return;

        const isLight = body.classList.contains("light-mode");

        themeToggle.innerHTML = `<i data-lucide="${isLight ? "moon" : "sun"}"></i>`;
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to night mode" : "Switch to day mode"
        );
        themeToggle.setAttribute("title", isLight ? "Night mode" : "Day mode");

        renderIcons();
    }

    // Restore saved theme (dark is the default).
    if (readSavedTheme() === "light") {
        body.classList.add("light-mode");
    }

    updateThemeIcon();

    themeToggle?.addEventListener("click", () => {
        body.classList.toggle("light-mode");

        saveTheme(body.classList.contains("light-mode") ? "light" : "dark");
        updateThemeIcon();
    });


    // =====================================
    // 2. MOBILE NAVBAR
    // =====================================

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

        menuBtn.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';

        renderIcons();
    });

    navLinks?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close the mobile menu when clicking outside.
    document.addEventListener("click", (event) => {
        if (
            navLinks?.classList.contains("open") &&
            !navLinks.contains(event.target) &&
            !menuBtn?.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Close the mobile menu with the Escape key.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navLinks?.classList.contains("open")) {
            closeMenu();
            menuBtn?.focus();
        }
    });

    // Close the menu when switching back to desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });


    // =====================================
    // 3. COPY EMAIL ADDRESS
    // =====================================

    const copyEmailBtn = document.getElementById("copyEmail");
    const emailAddress = document.getElementById("emailAddress");

    copyEmailBtn?.addEventListener("click", async () => {
        const email = emailAddress?.textContent.trim();

        if (!email || email.includes("your.email@example.com")) {
            showFeedback(
                "Please replace the example email address with your real email first.",
                "error"
            );
            return;
        }

        try {
            await navigator.clipboard.writeText(email);

            copyEmailBtn.innerHTML = '<i data-lucide="check"></i>';
            copyEmailBtn.setAttribute("title", "Email copied");
            renderIcons();

            showFeedback("Email address copied to clipboard.", "success");

            setTimeout(() => {
                copyEmailBtn.innerHTML = '<i data-lucide="copy"></i>';
                copyEmailBtn.setAttribute("title", "Copy email");
                renderIcons();
            }, 2000);

        } catch (error) {
            // Clipboard API may require HTTPS or localhost.
            showFeedback(
                "Unable to copy automatically. Please select and copy the email address.",
                "error"
            );
        }
    });


    // =====================================
    // 4. MESSAGE CHARACTER COUNTER
    // =====================================

    const messageInput = document.getElementById("message");
    const characterCount = document.getElementById("characterCount");

    function updateCharacterCount() {
        if (!messageInput || !characterCount) return;

        const length = messageInput.value.length;

        characterCount.textContent = `${length} / 1000`;

        characterCount.style.color =
            length >= 900
                ? "var(--accent-text)"
                : "";
    }

    messageInput?.addEventListener("input", updateCharacterCount);

    updateCharacterCount();


    // =====================================
    // 5. FORM VALIDATION
    // =====================================

    const contactForm = document.getElementById("contactForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    const sendBtn = document.getElementById("sendBtn");
    const sendBtnText = document.getElementById("sendBtnText");

    function setFieldError(input, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
        }

        if (input) {
            input.classList.toggle("invalid", Boolean(message));
            input.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );
        }
    }

    function validateForm() {
        let isValid = true;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = messageInput.value.trim();

        // Name
        if (name.length < 2) {
            setFieldError(
                nameInput,
                nameError,
                "Please enter your name (at least 2 characters)."
            );
            isValid = false;
        } else {
            setFieldError(nameInput, nameError, "");
        }

        // Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setFieldError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );
            isValid = false;
        } else {
            setFieldError(emailInput, emailError, "");
        }

        // Subject
        if (!subject) {
            setFieldError(
                subjectInput,
                subjectError,
                "Please select a subject."
            );
            isValid = false;
        } else {
            setFieldError(subjectInput, subjectError, "");
        }

        // Message
        if (message.length < 10) {
            setFieldError(
                messageInput,
                messageError,
                "Please enter a message of at least 10 characters."
            );
            isValid = false;
        } else {
            setFieldError(messageInput, messageError, "");
        }

        return isValid;
    }


    // Remove individual errors as the user corrects fields.
    [
        [nameInput, nameError],
        [emailInput, emailError],
        [subjectInput, subjectError],
        [messageInput, messageError]
    ].forEach(([input, errorElement]) => {
        input?.addEventListener("input", () => {
            if (input.value.trim()) {
                setFieldError(input, errorElement, "");
            }
        });

        input?.addEventListener("change", () => {
            if (input.value.trim()) {
                setFieldError(input, errorElement, "");
            }
        });
    });


    // =====================================
    // 6. FEEDBACK MESSAGES
    // =====================================

    const formFeedback = document.getElementById("formFeedback");

    function showFeedback(message, type) {
        if (!formFeedback) return;

        formFeedback.textContent = message;
        formFeedback.className = `form-feedback show ${type}`;
    }

    function clearFeedback() {
        if (!formFeedback) return;

        formFeedback.textContent = "";
        formFeedback.className = "form-feedback";
    }


    // =====================================
    // 7. SUBMIT CONTACT FORM
    // =====================================

    contactForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        clearFeedback();

        if (!validateForm()) {
            showFeedback(
                "Please check the highlighted fields and try again.",
                "error"
            );

            contactForm.querySelector(".invalid")?.focus();
            return;
        }

        const recipient = emailAddress?.textContent.trim();

        if (
            !recipient ||
            recipient.includes("your.email@example.com")
        ) {
            showFeedback(
                "Please configure your real email address in contact.html before using the form.",
                "error"
            );
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = messageInput.value.trim();

        const emailSubject = encodeURIComponent(
            `${subject} — Portfolio Contact`
        );

        const emailBody = encodeURIComponent(
            `Hello Aadarsh,\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Subject: ${subject}\n\n` +
            `Message:\n${message}\n`
        );

        const mailtoLink =
            `mailto:${recipient}` +
            `?subject=${emailSubject}` +
            `&body=${emailBody}`;

        // Open the visitor's configured email application.
        // This does not send the message automatically.
        sendBtn.disabled = true;
        sendBtnText.textContent = "Opening email app...";

        try {
            window.location.href = mailtoLink;

            showFeedback(
                "Your email application should open with your message prepared. Review it and press Send to deliver your message.",
                "success"
            );
        } catch (error) {
            showFeedback(
                "Unable to open your email application. Please email me directly using the address shown on this page.",
                "error"
            );
        }

        // Re-enable shortly after so the button doesn't stay locked
        // if the visitor comes back from their email app.
        setTimeout(() => {
            sendBtn.disabled = false;
            sendBtnText.textContent = "Send Message";
        }, 2500);
    });


    // =====================================
    // 8. INITIAL ICON RENDER
    // =====================================

    renderIcons();

});
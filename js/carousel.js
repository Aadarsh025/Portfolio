/*
    ============================================================
    REUSABLE 3D CAROUSEL
    ============================================================

    This component is intentionally framework-free.

    It supports:
    - Previous / next buttons
    - Clickable side cards
    - Keyboard arrows
    - Mouse dragging
    - Touch/swipe
    - Pagination dots
    - Optional autoplay
    - Infinite looping
    - Reduced-motion support

    You can reuse the same class for:
    Projects, Blog, Testimonials, etc.
*/

class ThreeDCarousel {
    constructor(selector, options = {}) {
        this.root = document.querySelector(selector);

        if (!this.root) {
            throw new Error(`Carousel element "${selector}" was not found.`);
        }

        this.track = this.root.querySelector(".carousel-track");
        this.prevButton = this.root.querySelector(".carousel-prev");
        this.nextButton = this.root.querySelector(".carousel-next");
        this.dotsContainer = this.root.querySelector(".carousel-dots");

        this.items = options.items || [];
        this.renderCard = options.renderCard || this.defaultCard;
        this.autoplay = options.autoplay ?? false;
        this.autoplayDelay = options.autoplayDelay || 5000;

        this.currentIndex = 0;
        this.timer = null;

        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.render();
        this.bindEvents();

        if (this.autoplay && !this.reduceMotion) {
            this.startAutoplay();
        }
    }

    render() {
        this.track.innerHTML = "";

        this.items.forEach((item, index) => {
            const card = this.renderCard(item, index);
            card.classList.add("project-card");
            card.dataset.index = index;

            this.track.appendChild(card);
        });

        this.renderDots();
        this.update();
    }

    renderDots() {
        this.dotsContainer.innerHTML = "";

        this.items.forEach((_, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", `Go to item ${index + 1}`);

            dot.addEventListener("click", () => {
                this.goTo(index);
            });

            this.dotsContainer.appendChild(dot);
        });
    }

    bindEvents() {
        this.prevButton.addEventListener("click", () => {
            this.previous();
            this.restartAutoplay();
        });

        this.nextButton.addEventListener("click", () => {
            this.next();
            this.restartAutoplay();
        });

        this.root.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                this.previous();
                this.restartAutoplay();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                this.next();
                this.restartAutoplay();
            }
        });

        this.root.setAttribute("tabindex", "0");

        this.track.addEventListener("click", (event) => {
            const card = event.target.closest(".project-card");

            if (!card) {
                return;
            }

            const clickedIndex = Number(card.dataset.index);

            if (clickedIndex !== this.currentIndex) {
                this.goTo(clickedIndex);
            }
        });

        this.track.addEventListener(
            "pointerdown",
            (event) => this.pointerDown(event)
        );

        window.addEventListener(
            "pointermove",
            (event) => this.pointerMove(event)
        );

        window.addEventListener(
            "pointerup",
            (event) => this.pointerUp(event)
        );

        this.root.addEventListener("mouseenter", () => {
            if (this.autoplay) {
                this.pauseAutoplay();
            }
        });

        this.root.addEventListener("mouseleave", () => {
            if (this.autoplay && !this.reduceMotion) {
                this.startAutoplay();
            }
        });
    }

    pointerDown(event) {
        this.isDragging = true;
        this.startX = event.clientX;
        this.currentX = event.clientX;

        this.track.classList.add("is-dragging");
    }

    pointerMove(event) {
        if (!this.isDragging) {
            return;
        }

        this.currentX = event.clientX;
    }

    pointerUp() {
        if (!this.isDragging) {
            return;
        }

        const distance = this.currentX - this.startX;

        this.isDragging = false;
        this.track.classList.remove("is-dragging");

        if (Math.abs(distance) < 50) {
            return;
        }

        if (distance < 0) {
            this.next();
        } else {
            this.previous();
        }

        this.restartAutoplay();
    }

    next() {
        this.currentIndex =
            (this.currentIndex + 1) % this.items.length;

        this.update();
    }

    previous() {
        this.currentIndex =
            (this.currentIndex - 1 + this.items.length) %
            this.items.length;

        this.update();
    }

    goTo(index) {
        if (index < 0 || index >= this.items.length) {
            return;
        }

        this.currentIndex = index;
        this.update();
        this.restartAutoplay();
    }

    getRelativePosition(index) {
        const total = this.items.length;
        let difference = index - this.currentIndex;

        if (difference > total / 2) {
            difference -= total;
        }

        if (difference < -total / 2) {
            difference += total;
        }

        return difference;
    }

    update() {
        const cards = this.track.querySelectorAll(".project-card");
        const dots = this.dotsContainer.querySelectorAll(".carousel-dot");

        cards.forEach((card, index) => {
            const position = this.getRelativePosition(index);

            card.dataset.position = this.getPositionName(position);

            card.setAttribute(
                "aria-hidden",
                position === 0 ? "false" : "true"
            );
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                "active",
                index === this.currentIndex
            );
        });
    }

    getPositionName(position) {
        if (position === 0) return "0";
        if (position === -1) return "-1";
        if (position === 1) return "1";
        if (position === -2) return "-2";
        if (position === 2) return "2";

        return position < 0
            ? "hidden-left"
            : "hidden-right";
    }

    startAutoplay() {
        if (this.items.length < 2) {
            return;
        }

        this.pauseAutoplay();

        this.timer = setInterval(() => {
            this.next();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    restartAutoplay() {
        if (this.autoplay && !this.reduceMotion) {
            this.startAutoplay();
        }
    }

    defaultCard(item, index) {
        const card = document.createElement("article");

        card.innerHTML = `
            <div class="card-image">
                <img
                    src="${item.image}"
                    alt="${item.title} project preview"
                    draggable="false"
                >
                <span class="card-index">
                    ${String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <div class="card-content">

                <div>
                    <div class="card-top">
                        <h3 class="card-title">
                            ${item.title}
                        </h3>

                        <span class="card-type">
                            ${item.type}
                        </span>
                    </div>

                    <p class="card-description">
                        ${item.description}
                    </p>
                </div>

                <div class="card-bottom">

                    <div class="tech-list">
                        ${item.tech
                            .map((technology) => `
                                <span>${technology}</span>
                            `)
                            .join("")}
                    </div>

                    <div class="card-links">
                        <a
                            href="${item.demo}"
                            target="_blank"
                            rel="noreferrer">
                            View Project →
                        </a>

                        <a
                            href="${item.github}"
                            target="_blank"
                            rel="noreferrer">
                            GitHub
                        </a>
                    </div>

                </div>

            </div>
        `;

        return card;
    }
}

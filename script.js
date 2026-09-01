/* =========================================================
   SKILLSWAP - INTERACTIVE UI
   Cursor Glow + Glass Effect + Hover Animations
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================= CURSOR GLOW ================= */

    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });


    /* ================= DYNAMIC STYLES ================= */

    const style = document.createElement("style");

    style.textContent = `

        /* ---------- CURSOR GLOW ---------- */

        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;

            background: radial-gradient(
                circle,
                rgba(108, 92, 231, 0.14) 0%,
                rgba(108, 92, 231, 0.07) 30%,
                transparent 70%
            );

            transform: translate(-50%, -50%);
            transition:
                left 0.08s ease-out,
                top 0.08s ease-out;

            mix-blend-mode: multiply;
        }


        /* ---------- GLASS EFFECT ---------- */

        .skill-card,
        .mentor-card,
        .profile-showcase,
        .floating-card,
        .mission-card,
        .hero-search {
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
        }


        /* ---------- CARD HOVER ---------- */

        .skill-card,
        .mentor-card,
        .floating-card,
        .mission-card {
            transition:
                transform 0.35s ease,
                box-shadow 0.35s ease,
                border-color 0.35s ease;
        }


        .skill-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow:
                0 25px 60px rgba(108, 92, 231, 0.16);
        }


        .mentor-card:hover {
            transform: translateY(-10px) scale(1.025);
            box-shadow:
                0 25px 60px rgba(108, 92, 231, 0.16);
        }


        .mission-card:hover {
            transform: translateY(-6px);
            box-shadow:
                0 30px 70px rgba(45, 38, 100, 0.18);
        }


        /* ---------- PROFILE HOVER ---------- */

        .profile-showcase {
            transition:
                transform 0.4s ease,
                box-shadow 0.4s ease;
        }

        .profile-showcase:hover {
            transform: rotate(0deg) translateY(-8px);
            box-shadow:
                0 40px 90px rgba(45, 38, 100, 0.22);
        }


        /* ---------- BUTTON HOVER ---------- */

        button,
        a {
            transition:
                transform 0.25s ease,
                box-shadow 0.25s ease,
                background 0.25s ease,
                color 0.25s ease;
        }


        /* ---------- SKILL ICON ANIMATION ---------- */

        .skill-card:hover .skill-icon {
            transform: rotate(-6deg) scale(1.1);
        }

        .skill-icon {
            transition: transform 0.3s ease;
        }


        /* ---------- MENTOR AVATAR ---------- */

        .mentor-card:hover .mentor-avatar {
            transform: scale(1.08) rotate(-3deg);
        }

        .mentor-avatar {
            transition: transform 0.35s ease;
        }


        /* ---------- FLOATING CARDS ---------- */

        .floating-card {
            transition:
                transform 0.3s ease,
                box-shadow 0.3s ease;
        }

        .floating-card:hover {
            transform: translateY(-8px) scale(1.04);
            box-shadow:
                0 25px 60px rgba(30, 25, 70, 0.18);
        }


        /* ---------- NAVBAR GLASS ---------- */

        .navbar {
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
        }


        /* ---------- LINK UNDERLINE ---------- */

        .nav-links a {
            position: relative;
        }

        .nav-links a::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -6px;
            width: 0;
            height: 2px;
            background: var(--primary);
            border-radius: 10px;
            transition: width 0.25s ease;
        }

        .nav-links a:hover::after {
            width: 100%;
        }


        /* ---------- REDUCE EFFECTS ON MOBILE ---------- */

        @media (max-width: 850px) {
            .cursor-glow {
                display: none;
            }
        }

    `;

    document.head.appendChild(style);


    /* ================= MOBILE MENU ================= */

    const mobileMenu = document.querySelector(".mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }


    /* ================= SEARCH ================= */

    const searchInput = document.querySelector(".hero-search input");
    const searchButton = document.querySelector(".hero-search button");

    if (searchInput && searchButton) {

        searchButton.addEventListener("click", () => {

            const skill = searchInput.value.trim();

            if (skill !== "") {
                alert(`Searching for: ${skill}`);
            } else {
                alert("Please enter a skill to search.");
            }

        });

        searchInput.addEventListener("keypress", (event) => {

            if (event.key === "Enter") {
                searchButton.click();
            }

        });
    }


    /* ================= SCROLL REVEAL ================= */

    const revealElements = document.querySelectorAll(
        ".skill-card, .mentor-card, .step, .mission-card"
    );

    revealElements.forEach((element) => {

        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";

    });


    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );


    revealElements.forEach((element) => {
        observer.observe(element);
    });


    console.log("SkillSwap interactive UI loaded successfully 🚀");

});
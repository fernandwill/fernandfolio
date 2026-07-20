document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Scroll animation with IntersectionObserver
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll("section").forEach(section => {
        const elements = section.querySelectorAll("h1, h2, h3, p, div, span, article, button");
        elements.forEach(el => {
            el.classList.add("fade-in");
            observer.observe(el);
        });
    });

    // Cursor-following gradient effect
    const gradientText = document.querySelector(".hero-title span");
    if (gradientText) {
        const goldStops = ["#f9e79f", "#d4af37", "#b68b2e"];
        gradientText.style.backgroundImage = `linear-gradient(90deg, ${goldStops.join(", ")})`;
        gradientText.style.backgroundSize = "220% 220%";
        gradientText.style.transition = "background-image 0.4s ease";

        document.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const x = clientX - innerWidth / 2;
            const y = clientY - innerHeight / 2;
            const angle = Math.atan2(y, x) * (180 / Math.PI);

            gradientText.style.backgroundImage = `linear-gradient(${angle + 90}deg, ${goldStops.join(", ")})`;
        });
    }


});

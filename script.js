const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const revealItems = document.querySelectorAll(".reveal");
const tiltTarget = document.querySelector("[data-tilt]");

if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18
    });

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });
}

if (tiltTarget) {
    tiltTarget.addEventListener("mousemove", (event) => {
        const rect = tiltTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        const rotateX = (0.5 - (y / rect.height)) * 8;

        tiltTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltTarget.addEventListener("mouseleave", () => {
        tiltTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        formStatus.textContent = "Sending your message...";
        formStatus.className = "form-status";
        submitButton.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            contactForm.reset();
            formStatus.textContent = "Message sent successfully. I'll receive your inquiry shortly.";
            formStatus.className = "form-status is-success";
        } catch (error) {
            formStatus.textContent = "Something went wrong. Please try again in a moment.";
            formStatus.className = "form-status is-error";
        } finally {
            submitButton.disabled = false;
        }
    });
}

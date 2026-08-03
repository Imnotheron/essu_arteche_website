document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-section form");

    if (!form) {
        return;
    }

    const modal = document.createElement("div");
    modal.className = "contact-modal";
    modal.hidden = true;
    modal.innerHTML = `
        <section
            class="contact-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            aria-describedby="contact-modal-message">
            <button
                class="contact-modal__close"
                type="button"
                aria-label="Close submission dialog">
                &times;
            </button>

            <div class="contact-modal__icon" aria-hidden="true">!</div>
            <p class="contact-modal__eyebrow">Contact Form</p>
            <h2 id="contact-modal-title">Submit this message?</h2>
            <p id="contact-modal-message" class="contact-modal__message">
                Please review the information below before confirming your submission.
            </p>

            <dl class="contact-modal__summary">
                <div>
                    <dt>Full name</dt>
                    <dd data-summary-name></dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd data-summary-email></dd>
                </div>
                <div>
                    <dt>Course</dt>
                    <dd data-summary-course></dd>
                </div>
                <div>
                    <dt>Message</dt>
                    <dd data-summary-message></dd>
                </div>
            </dl>

            <div class="contact-modal__actions">
                <button class="contact-modal__button contact-modal__button--secondary" type="button" data-modal-cancel>
                    Cancel
                </button>
                <button class="contact-modal__button contact-modal__button--primary" type="button" data-modal-confirm>
                    Confirm submission
                </button>
            </div>
        </section>
    `;

    document.body.appendChild(modal);

    const dialog = modal.querySelector(".contact-modal__dialog");
    const title = modal.querySelector("#contact-modal-title");
    const message = modal.querySelector("#contact-modal-message");
    const summary = modal.querySelector(".contact-modal__summary");
    const closeButton = modal.querySelector(".contact-modal__close");
    const cancelButton = modal.querySelector("[data-modal-cancel]");
    const confirmButton = modal.querySelector("[data-modal-confirm]");
    const nameSummary = modal.querySelector("[data-summary-name]");
    const emailSummary = modal.querySelector("[data-summary-email]");
    const courseSummary = modal.querySelector("[data-summary-course]");
    const messageSummary = modal.querySelector("[data-summary-message]");

    let previouslyFocusedElement = null;
    let closeTimer = null;

    const getFieldValue = (selector, fallback = "Not provided") => {
        const field = form.querySelector(selector);
        const value = field ? field.value.trim() : "";
        return value || fallback;
    };

    const resetModalContent = () => {
        title.textContent = "Submit this message?";
        message.textContent = "Please review the information below before confirming your submission.";
        summary.hidden = false;
        confirmButton.hidden = false;
        cancelButton.textContent = "Cancel";
        modal.classList.remove("contact-modal--success");
    };

    const openModal = () => {
        window.clearTimeout(closeTimer);
        resetModalContent();

        const fullMessage = getFieldValue("#message", "No message entered");
        const shortenedMessage = fullMessage.length > 140
            ? `${fullMessage.slice(0, 137)}...`
            : fullMessage;

        nameSummary.textContent = getFieldValue("#fullname");
        emailSummary.textContent = getFieldValue("#email");
        courseSummary.textContent = getFieldValue("#course");
        messageSummary.textContent = shortenedMessage;

        previouslyFocusedElement = document.activeElement;
        modal.hidden = false;
        document.body.classList.add("modal-open");

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
            confirmButton.focus();
        });
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        document.body.classList.remove("modal-open");

        closeTimer = window.setTimeout(() => {
            modal.hidden = true;
            previouslyFocusedElement?.focus();
        }, 220);
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        openModal();
    });

    confirmButton.addEventListener("click", () => {
        const submittedName = getFieldValue("#fullname", "there");

        title.textContent = "Submission confirmed";
        message.textContent = `Thank you, ${submittedName}. Your contact form has been submitted successfully.`;
        summary.hidden = true;
        confirmButton.hidden = true;
        cancelButton.textContent = "Close";
        modal.classList.add("contact-modal--success");
        form.reset();
        cancelButton.focus();
    });

    closeButton.addEventListener("click", closeModal);
    cancelButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    dialog.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") {
            return;
        }

        const focusableElements = [...dialog.querySelectorAll(
            'button:not([hidden]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )];

        if (!focusableElements.length) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
});

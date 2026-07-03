const preloader = document.getElementById("preloader");
const particleField = document.getElementById("particle-field");
const themeToggle = document.getElementById("theme-toggle");
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const typewriterText = document.getElementById("typewriter-text");
const heroTypedText = document.getElementById("hero-typed-text");
const heroNameText = document.querySelector(".hero-title-name");
const eyebrowText = document.getElementById("eyebrow-text");
const revealItems = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-track span");

const typeLines = [
  "Machine learning for practical problem solving.",
  "Deep learning workflows for image-based diagnosis.",
  "Image intelligence projects with real-world potential."
];

const eyebrowLine = "Artificial Intelligence / Machine Learning / Medical Imaging";

const heroHeadline = "builds intelligent systems for meaningful impact.";

function hidePreloader() {
  window.setTimeout(() => {
    preloader.classList.add("hidden");
  }, 750);
}

function createParticles() {
  if (!particleField) {
    return;
  }

  const particleCount = 18;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.animationDuration = `${Math.random() * 12 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particleField.appendChild(particle);
  }
}

function startTypewriter() {
  if (!typewriterText) {
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentLine = typeLines[lineIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typewriterText.textContent = currentLine.slice(0, charIndex);

    let delay = isDeleting ? 45 : 70;

    if (!isDeleting && charIndex === currentLine.length) {
      delay = 1300;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % typeLines.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  }

  typewriterText.textContent = "";
  window.setTimeout(tick, 900);
}

function startEyebrowTyping() {
  if (!eyebrowText) {
    return;
  }

  let index = 0;

  function typeNext() {
    eyebrowText.textContent = eyebrowLine.slice(0, index);

    if (index < eyebrowLine.length) {
      index += 1;
      window.setTimeout(typeNext, 60);
    }
  }

  eyebrowText.textContent = "";
  window.setTimeout(typeNext, 200);
}

function startHeroHeadlineTyping() {
  if (!heroTypedText) {
    return;
  }

  let index = 0;

  function typeNext() {
    heroTypedText.textContent = heroHeadline.slice(0, index);

    if (index < heroHeadline.length) {
      index += 1;
      window.setTimeout(typeNext, 55);
    }
  }

  heroTypedText.textContent = "";
  window.setTimeout(typeNext, 1200);
}

function startHeroNameTyping() {
  if (!heroNameText) {
    return;
  }

  const nameText = heroNameText.dataset.text || heroNameText.textContent.trim();
  let index = 0;

  function typeNext() {
    heroNameText.textContent = nameText.slice(0, index);

    if (index < nameText.length) {
      index += 1;
      window.setTimeout(typeNext, 70);
    }
  }

  heroNameText.textContent = "";
  window.setTimeout(typeNext, 100);
}

function observeReveals() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    skillBars.forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        if (entry.target.classList.contains("skill-panel")) {
          skillBars.forEach((bar, index) => {
            window.setTimeout(() => {
              bar.style.width = bar.dataset.width;
            }, index * 140);
          });
        }

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 60}ms`;
    observer.observe(item);
  });
}

function setupThemeToggle() {
  const storedTheme = localStorage.getItem("portfolio-theme");

  if (storedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const theme = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("portfolio-theme", theme);
  });
}

function setupContactForm() {
  if (!form || !formStatus) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const submitButton = form.querySelector("button[type='submit']");

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.className = "form-status error";
      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
      }

      formStatus.textContent = "Sending your message...";
      formStatus.className = "form-status";

      const response = await fetch("https://formsubmit.co/ajax/niteshkrbgp8@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "Portfolio Contact Message",
          _captcha: "false",
          _template: "table",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("Unable to send");
      }

      formStatus.textContent = "Message sent successfully. I will reply on your email.";
      formStatus.className = "form-status success";
      form.reset();
    } catch (error) {
      formStatus.textContent = "Message failed to send. Please try again or email directly.";
      formStatus.className = "form-status error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

window.addEventListener("load", hidePreloader);

createParticles();
startEyebrowTyping();
startHeroNameTyping();
startHeroHeadlineTyping();
startTypewriter();
observeReveals();
setupThemeToggle();
setupContactForm();

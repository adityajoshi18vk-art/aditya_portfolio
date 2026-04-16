// Theme Toggle (Dark/Light Mode)
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.add("light-mode");
    if(themeToggle) themeToggle.textContent = "☀️";
}

if(themeToggle) {
    themeToggle.onclick = () => {
        body.classList.toggle("light-mode");
        const isLight = body.classList.contains("light-mode");
        themeToggle.textContent = isLight ? "☀️" : "🌙";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    }
}


// mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if(menuToggle && navLinks) {
    menuToggle.onclick = () => {
        navLinks.classList.toggle("active");
    }
}

// close menu after clicking link

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
        if(navLinks) navLinks.classList.remove("active");
    })

})


// navbar shadow when scrolling
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.4)"
    }
    else {
        navbar.style.boxShadow = "none"
    }
})

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal-on-scroll").forEach(section => {
    revealObserver.observe(section);
});

// Active Link Highlighting
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("href").includes(current)) {
            item.classList.add("active");
        }
    });
});


// ========== Web3Forms Contact Form ==========

// Paste your Web3Forms Access Key here
const WEB3FORMS_API_KEY = "fe99f1e4-2dc0-4e3b-a633-abdad5f5a4a2";

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".contact-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";

    // Diagnostic: Check if API Key is still placeholder
    if (WEB3FORMS_API_KEY === "YOUR_WEB3FORMS_API_KEY" || !WEB3FORMS_API_KEY) {
        formStatus.textContent = "⚠️ Please paste your Web3Forms API Key in script.js to enable the form.";
        formStatus.style.color = "#fbbf24";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message →";
        return;
    }

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());
    formObject.access_key = WEB3FORMS_API_KEY;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: 'POST',
            body: JSON.stringify(formObject),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            formStatus.textContent = "✅ Message sent successfully! I'll get back to you soon.";
            formStatus.style.color = "#4ade80";
            contactForm.reset();
        } else {
            const data = await response.json();
            formStatus.textContent = "❌ Error: " + (data.message || "Failed to send message. Please try again.");
            formStatus.style.color = "#f87171";
        }
    } catch (error) {
        console.error("Form Error:", error);
        formStatus.textContent = "❌ Critical failure. Please check your internet connection.";
        formStatus.style.color = "#f87171";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message →";
    }
});
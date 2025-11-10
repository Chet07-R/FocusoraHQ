// ✅ EmailJS Handler for FocusoraHQ
// This file keeps EmailJS logic separate from dynamically loaded HTML

document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS with your public key (safe to expose)
  emailjs.init("ia_jZUu19Ui5dHTqg");
  console.log("📩 EmailJS initialized successfully.");
});

// ✅ Handle Newsletter Subscription
function handleSubscription() {
  const emailInput = document.getElementById("subscriber_email");
  if (!emailInput) {
    console.warn("⚠️ Footer not loaded yet — email input not found.");
    return;
  }

  const userEmail = emailInput.value.trim();

  // Validate user input
  if (!userEmail) {
    showToast("⚠️ Please enter your email address.", "warning");
    return;
  }

  const params = { user_email: userEmail };

  // Send email using EmailJS
  emailjs.send("service_mj850sc", "template_xz8bp6i", params)
    .then(() => {
      showToast("✅ Subscription successful! Check your email.", "success");
      emailInput.value = "";
    })
    .catch((error) => {
      console.error("❌ EmailJS Error:", error);
      showToast("❌ Failed to send email. Please try again later.", "error");
    });
}

/* ✅ Optional Toast Notifications (Tailwind-based)
   Cleaner than alerts — fits FocusoraHQ’s modern design
*/
function showToast(message, type = "info") {
  const colors = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-gray-700 text-white"
  };

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-500 transform opacity-0 translate-y-2 ${colors[type]} font-medium`;

  document.body.appendChild(toast);

  // Animate toast appearance
  setTimeout(() => toast.classList.remove("opacity-0", "translate-y-2"), 100);

  // Remove toast after 3.5 seconds
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

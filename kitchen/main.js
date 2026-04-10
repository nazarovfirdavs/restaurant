const form = document.getElementById("bookingForm");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const modal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModalBtn");

const heroBookingBtn = document.getElementById("heroBookingBtn");
const heroFormTrigger = document.getElementById("heroFormTrigger");
const navBookingLink = document.getElementById("navBookingLink");

function scrollToBooking() {
  const bookingSection = document.getElementById("bookingSection");
  if (bookingSection) {
    bookingSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    bookingSection.style.transition = "box-shadow 0.3s";
    bookingSection.style.boxShadow =
      "0 0 0 3px rgba(194,110,46,0.3), 0 12px 30px rgba(0,0,0,0.05)";
    setTimeout(() => {
      bookingSection.style.boxShadow = "";
    }, 1000);
  }
}

if (heroBookingBtn) heroBookingBtn.addEventListener("click", scrollToBooking);
if (heroFormTrigger) heroFormTrigger.addEventListener("click", scrollToBooking);
if (navBookingLink) navBookingLink.addEventListener("click", scrollToBooking);

function showSuccessModal() {
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function showFieldError(input, message) {
  input.style.borderColor = "#d9534f";
  input.style.backgroundColor = "#fff8f8";
  let errorSpan = input.parentNode.querySelector(".field-error-msg");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "field-error-msg";
    errorSpan.style.fontSize = "0.75rem";
    errorSpan.style.color = "#d9534f";
    errorSpan.style.marginTop = "0.25rem";
    errorSpan.style.display = "block";
    input.parentNode.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

function resetFieldErrors() {
  [nameInput, surnameInput, emailInput, phoneInput].forEach((input) => {
    input.style.borderColor = "#e0cfc0";
    input.style.backgroundColor = "#fefcf9";
    const parent = input.parentNode;
    const err = parent.querySelector(".field-error-msg");
    if (err) err.remove();
  });
}

function removeIndividualError(input) {
  input.style.borderColor = "#e0cfc0";
  input.style.backgroundColor = "#fefcf9";
  const parent = input.parentNode;
  const errSpan = parent.querySelector(".field-error-msg");
  if (errSpan) errSpan.remove();
}

function validateForm() {
  let isValid = true;
  resetFieldErrors();

  const nameVal = nameInput.value.trim();
  const surnameVal = surnameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const phoneVal = phoneInput.value.trim();

  if (nameVal === "") {
    showFieldError(nameInput, "Пожалуйста, укажите имя");
    isValid = false;
  } else if (nameVal.length < 2) {
    showFieldError(nameInput, "Имя должно содержать хотя бы 2 буквы");
    isValid = false;
  }

  if (surnameVal === "") {
    showFieldError(surnameInput, "Пожалуйста, укажите фамилию");
    isValid = false;
  } else if (surnameVal.length < 2) {
    showFieldError(surnameInput, "Фамилия должна содержать хотя бы 2 буквы");
    isValid = false;
  }

  if (emailVal === "") {
    showFieldError(emailInput, "Введите email");
    isValid = false;
  } else {
    const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailPattern.test(emailVal)) {
      showFieldError(
        emailInput,
        "Введите корректный email (например, name@domain.ru)",
      );
      isValid = false;
    }
  }

  if (phoneVal === "") {
    showFieldError(phoneInput, "Введите номер телефона");
    isValid = false;
  } else {
    const digitsOnly = phoneVal.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      showFieldError(
        phoneInput,
        "Номер телефона слишком короткий (минимум 10 цифр)",
      );
      isValid = false;
    } else if (digitsOnly.length > 15) {
      showFieldError(phoneInput, "Номер телефона слишком длинный");
      isValid = false;
    }
  }
  return isValid;
}

function handleSubmit(event) {
  event.preventDefault();
  if (validateForm()) {
    showSuccessModal();
    console.log("Бронирование успешно:", {
      name: nameInput.value,
      surname: surnameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
    });
  } else {
    const firstInvalid = [nameInput, surnameInput, emailInput, phoneInput].find(
      (input) => input.style.borderColor === "rgb(217, 83, 79)",
    );
    if (firstInvalid) {
      firstInvalid.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      firstInvalid.focus();
    }
  }
}

form.addEventListener("submit", handleSubmit);
form.setAttribute("novalidate", "novalidate");

nameInput.addEventListener("input", () => removeIndividualError(nameInput));
surnameInput.addEventListener("input", () =>
  removeIndividualError(surnameInput),
);
emailInput.addEventListener("input", () => removeIndividualError(emailInput));
phoneInput.addEventListener("input", () => removeIndividualError(phoneInput));

const track = document.getElementById("multiTrack");
const slides = Array.from(document.querySelectorAll(".slide-card"));
const totalSlides = slides.length;
let currentIndex = 0;
let autoInterval = null;
const AUTO_DELAY = 4000;

const prevBtn = document.getElementById("multiPrevBtn");
const nextBtn = document.getElementById("multiNextBtn");
const dotsContainer = document.getElementById("multiDotsContainer");

function getSlidesToShow() {
  if (window.innerWidth <= 550) return 1;
  if (window.innerWidth <= 800) return 2;
  return 3;
}

function getTotalDots() {
  const visible = getSlidesToShow();
  return Math.ceil(totalSlides / visible);
}

function getSlideWidth() {
  const wrapper = track?.parentElement;
  if (!wrapper) return 300;
  const wrapperWidth = wrapper.clientWidth;
  const visible = getSlidesToShow();
  const gap = 20;
  const slideWidth = (wrapperWidth - gap * (visible - 1)) / visible;
  return slideWidth;
}

function getStepWidth() {
  return getSlideWidth() + 20;
}

function updateSliderPosition() {
  if (!track) return;
  const stepWidth = getStepWidth();
  const offset = currentIndex * stepWidth;
  track.style.transform = `translateX(-${offset}px)`;
  updateDotsActive();
}

function nextSlide() {
  const visible = getSlidesToShow();
  const maxIndex = totalSlides - visible;

  if (currentIndex + 1 <= maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSliderPosition();
}

function prevSlide() {
  const visible = getSlidesToShow();
  const maxIndex = totalSlides - visible;

  if (currentIndex - 1 >= 0) {
    currentIndex--;
  } else {
    currentIndex = maxIndex;
  }
  updateSliderPosition();
}

function goToGroup(groupIndex) {
  const visible = getSlidesToShow();
  currentIndex = groupIndex * visible;
  if (currentIndex >= totalSlides) {
    currentIndex = totalSlides - visible;
  }
  if (currentIndex < 0) currentIndex = 0;
  updateSliderPosition();
}

function updateDotsActive() {
  const visible = getSlidesToShow();
  const currentGroupIndex = Math.floor(currentIndex / visible);
  const dots = document.querySelectorAll(".multi-dot");
  dots.forEach((dot, idx) => {
    if (idx === currentGroupIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  const totalDots = totalSlides;

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("div");
    dot.classList.add("multi-dot");
    if (i === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => {
      stopAutoPlay();
      goToSlide(i);
      startAutoPlay();
    });
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(slideIndex) {
  const visible = getSlidesToShow();
  const maxIndex = totalSlides - visible;
  if (slideIndex > maxIndex) {
    currentIndex = maxIndex;
  } else {
    currentIndex = slideIndex;
  }
  if (currentIndex < 0) currentIndex = 0;
  updateSliderPosition();
}

function updateDotsActive() {
  const dots = document.querySelectorAll(".multi-dot");
  dots.forEach((dot, idx) => {
    if (idx === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}
function startAutoPlay() {
  if (autoInterval) clearInterval(autoInterval);
  autoInterval = setInterval(() => {
    nextSlide();
  }, AUTO_DELAY);
}

function stopAutoPlay() {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
  }
}

let resizeTimeout;
function handleResize() {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const visible = getSlidesToShow();
    const maxIndex = totalSlides - visible;
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    createDots();
    updateSliderPosition();
  }, 150);
}

function initMultiSlider() {
  createDots();
  updateSliderPosition();

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  startAutoPlay();

  const container = document.querySelector(".slider-multi-container");
  if (container) {
    container.addEventListener("mouseenter", () => stopAutoPlay());
    container.addEventListener("mouseleave", () => startAutoPlay());
  }

  window.addEventListener("resize", handleResize);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMultiSlider);
} else {
  initMultiSlider();
}

const faqItems = document.querySelectorAll(".faq-item");

function initAccordion() {
  faqItems.forEach((item) => {
    const questionDiv = item.querySelector(".faq-question");
    const toggleBtn = item.querySelector(".toggle-btn");

    function toggleAnswer(e) {
      e.stopPropagation();
      const isOpen = item.classList.contains("open");

      if (isOpen) {
        item.classList.remove("open");
        if (toggleBtn) toggleBtn.textContent = "+";
      } else {
        item.classList.add("open");
        if (toggleBtn) toggleBtn.textContent = "−";
      }
    }

    if (questionDiv) {
      questionDiv.addEventListener("click", toggleAnswer);
    }
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleAnswer);
    }

    if (!item.classList.contains("open")) {
      item.classList.add("open");
      if (toggleBtn) toggleBtn.textContent = "−";
    }
  });
}

initAccordion();

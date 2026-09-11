const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

const mobileMenuOpenIcon = document.getElementById(
  "mobile-menu-open-icon"
);

const mobileMenuCloseIcon = document.getElementById(
  "mobile-menu-close-icon"
);

function setMobileMenuState(isOpen) {
  if (
    !mobileMenuButton ||
    !mobileMenu ||
    !mobileMenuOpenIcon ||
    !mobileMenuCloseIcon
  ) {
    return;
  }

  mobileMenuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  mobileMenuButton.setAttribute(
    "aria-label",
    isOpen
      ? "Close navigation menu"
      : "Open navigation menu"
  );

  mobileMenu.classList.toggle("hidden", !isOpen);

  mobileMenuOpenIcon.classList.toggle(
    "hidden",
    isOpen
  );

  mobileMenuCloseIcon.classList.toggle(
    "hidden",
    !isOpen
  );
}


if (
  mobileMenuButton &&
  mobileMenu &&
  mobileMenuOpenIcon &&
  mobileMenuCloseIcon
) {

  const mobileMenuLinks =
    mobileMenu.querySelectorAll("a");


  // Toggle menu
  mobileMenuButton.addEventListener("click", () => {

    const isOpen =
      mobileMenuButton.getAttribute(
        "aria-expanded"
      ) === "true";

    setMobileMenuState(!isOpen);
  });


  // Close after selecting a link
  mobileMenuLinks.forEach((link) => {

    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });

  });


  // Close with Escape
  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      setMobileMenuState(false);
    }

  });


  // Close when clicking outside
  document.addEventListener("click", (event) => {

    const clickedInsideMenu =
      mobileMenu.contains(event.target);

    const clickedMenuButton =
      mobileMenuButton.contains(event.target);

    if (
      !clickedInsideMenu &&
      !clickedMenuButton
    ) {
      setMobileMenuState(false);
    }

  });


  // Close when switching to desktop
  window.addEventListener("resize", () => {

    if (window.innerWidth >= 1024) {
      setMobileMenuState(false);
    }

  });


  // Initial state
  setMobileMenuState(false);
}
// Handle missing homepage images gracefully
const homepageImages = document.querySelectorAll(
  "img"
);

homepageImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("hidden");

    const fallback = document.createElement("div");

    fallback.className =
      "absolute inset-0 flex items-center justify-center bg-club-surface-muted text-center text-sm font-medium text-club-text-muted";

    fallback.textContent = "Image unavailable";

    const parent = image.parentElement;

    if (
      parent &&
      getComputedStyle(parent).position === "static"
    ) {
      parent.classList.add("relative");
    }

    if (parent) {
      parent.appendChild(fallback);
    }
  });
});
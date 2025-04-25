document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("auth-modal");
  const authTitle = document.getElementById("auth-modal-title");
  const authMessage = document.getElementById("auth-modal-message");
  const authCloseBtn = document.getElementById("auth-modal-close");
  const authLoginBtn = authModal.querySelector("a.btn-primary");
  const authRegisterBtn = authModal.querySelector("a.btn-secondary");

  document
    .querySelectorAll(
      'a.nav-item[href="/dashboard"], a.nav-item[href="/profile"]'
    )
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        if (!window.isLoggedIn) {
          e.preventDefault();
          if (link.getAttribute("href") === "/dashboard") {
            authTitle.textContent = "Accès restreint";
            authMessage.textContent =
              "Vous devez être connecté pour accéder à Mes Listes.";
            authLoginBtn.style.display = "inline-block";
            authRegisterBtn.style.display = "none";
          } else {
            authTitle.textContent = "Accès restreint";
            authMessage.textContent =
              "Vous devez être connecté pour accéder à votre Profil.";
            authLoginBtn.style.display = "inline-block";
            authRegisterBtn.style.display = "inline-block";
          }
          authModal.classList.remove("hidden");
        }
      });
    });

  authCloseBtn.addEventListener("click", () => {
    authModal.classList.add("hidden");
  });

  document.querySelectorAll(".accordion-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      const content = document.querySelectorAll(".accordion-content")[idx];
      content.classList.toggle("hidden");
    });
  });
});

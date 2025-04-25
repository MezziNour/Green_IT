document.addEventListener("DOMContentLoaded", () => {
  // Modale de création de liste
  const openBtn = document.getElementById("open-new-list");
  const modal = document.getElementById("new-list-modal");
  const closeBtn = document.getElementById("close-new-list");
  const overlay = document.querySelector(".modal-overlay");

  openBtn?.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
  overlay?.addEventListener("click", () => modal.classList.add("hidden"));

  // Modale de suppression de liste
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const confirmModal = document.getElementById("confirm-modal");
  const cancelBtn = document.getElementById("cancel-button");
  const closeConfirmBtn = document.getElementById("cancel-delete");
  const confirmForm = document.getElementById("confirm-form");
  const confirmText = document.getElementById("confirm-text");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
  
      const parentForm = btn.closest("form");
      const action = parentForm.getAttribute("action");
      const name = btn.getAttribute("data-list-name") || "cette liste";
  
      // Retient la carte à supprimer
      const card = parentForm.closest(".card-container");
      confirmForm.setAttribute("action", action);
      confirmForm.setAttribute("data-target-id", card.dataset.cardId); // pour identifier la bonne carte
  
      confirmText.innerHTML = `Voulez-vous vraiment supprimer la liste <strong>${name}</strong> ?`;
      confirmModal.classList.remove("hidden");
    });
  });
  
  confirmForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const targetId = confirmForm.getAttribute("data-target-id");
    const card = document.querySelector(`.card-container[data-card-id="${targetId}"]`);
  
    // Ajoute l'effet de fade
    card.classList.add("fade-out");
  
    // Envoie le formulaire après l’animation
    setTimeout(() => {
      confirmForm.submit();
    }, 400); // correspond à la durée CSS
  });
  

  [cancelBtn, closeConfirmBtn].forEach((btn) => {
    btn?.addEventListener("click", () => {
      confirmModal.classList.add("hidden");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
  
    // On applique la pluie de fleurs uniquement aux pages login & register
    if (!path.includes("/auth/login") && !path.includes("/auth/register")) return;
  
    const numberOfFlowers = 40;
  
    for (let i = 0; i < numberOfFlowers; i++) {
      const flower = document.createElement("img");
      flower.src = "/images/flower.png"; 
      flower.classList.add("falling-flower");
  
      flower.style.left = Math.random() * 100 + "vw";
      flower.style.animationDelay = Math.random() * 5 + "s";
      flower.style.animationDuration = 5 + Math.random() * 5 + "s";
  
      document.body.appendChild(flower);
    }
  });
  
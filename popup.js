document.addEventListener("DOMContentLoaded", () => {
    // Vérifie si un token est stocké
    chrome.storage.local.get("token", (result) => {
      if (result.token) {
        showAddFavoriteSection();
      } else {
        showLoginSection();
      }
    });
  });
  
  function showLoginSection() {
    document.getElementById("login-section").classList.remove("d-none");
    document.getElementById("add-favorite-section").classList.add("d-none");
  }
  
  function showAddFavoriteSection() {
    document.getElementById("login-section").classList.add("d-none");
    document.getElementById("add-favorite-section").classList.remove("d-none");
  }
  
  document.getElementById("loginButton").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("https://senfavorites.pythonanywhere.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.access;
  
        chrome.storage.local.set({ token }, () => {
          document.getElementById("loginStatus").innerText = "Connexion réussie !";
          showAddFavoriteSection();
        });
      } else {
        document.getElementById("loginStatus").innerText = "Erreur de connexion. Vérifiez vos identifiants.";
      }
    } catch (error) {
      document.getElementById("loginStatus").innerText = "Erreur réseau. Réessayez.";
    }
  });
  
  document.getElementById("saveButton").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
  
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;
  
    chrome.storage.local.get("token", async (result) => {
      const token = result.token;
  
      if (!token) {
        document.getElementById("status").innerText = "Veuillez vous connecter.";
        return;
      }
  
      const data = {
        title: title || "Titre par défaut",
        url: url,
        description: description || "",
      };
  
      try {
        const response = await fetch("https://senfavorites.pythonanywhere.com/api/add/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          document.getElementById("status").innerText = "Favori ajouté avec succès !";
          document.getElementById("status").classList.remove("text-danger");
          document.getElementById("status").classList.add("text-success");
        } else {
          document.getElementById("status").innerText = "Erreur lors de l'ajout.";
        }
      } catch (error) {
        document.getElementById("status").innerText = "Erreur réseau. Réessayez.";
      }
    });
  });
  
  document.getElementById("logoutButton").addEventListener("click", () => {
    chrome.storage.local.remove("token", () => {
      document.getElementById("status").innerText = "";
      showLoginSection();
    });
  });
  
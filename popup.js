document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si un token est stocké
  chrome.storage.local.get(["token", "refreshToken"], (result) => {
    if (result.token) {
      // Si un token est présent, on vérifie sa validité
      checkTokenValidity(result.token, result.refreshToken).then((isValid) => {
        if (isValid) {
          showAddFavoriteSection();
        } else {
          showLoginSection();
        }
      });
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

// Vérifie si le token est valide, sinon utilise le refresh token
async function checkTokenValidity(token, refreshToken) {
  try {
    const response = await fetch("https://senfavorites.pythonanywhere.com/api/token/verify/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      return true; // Le token est encore valide
    } else if (refreshToken) {
      // Si le token est expiré, on essaie de le rafraîchir
      const refreshResponse = await fetch("https://senfavorites.pythonanywhere.com/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newToken = data.access;

        // Sauvegarde le nouveau token
        chrome.storage.local.set({ token: newToken });
        return true;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification/rafraîchissement du token :", error);
  }

  return false; // Ni le token ni le refresh token n'ont fonctionné
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
      const refreshToken = data.refresh;

      // Sauvegarde les tokens dans le stockage local
      chrome.storage.local.set({ token, refreshToken }, () => {
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

  chrome.storage.local.get(["token", "refreshToken"], async (result) => {
    let token = result.token;

    if (!token) {
      document.getElementById("status").innerText = "Veuillez vous connecter.";
      return;
    }

    // Vérifie et rafraîchit le token si nécessaire
    const isValid = await checkTokenValidity(token, result.refreshToken);

    if (!isValid) {
      document.getElementById("status").innerText = "Session expirée. Veuillez vous reconnecter.";
      showLoginSection();
      return;
    }

    token = await new Promise((resolve) => {
      chrome.storage.local.get("token", (res) => resolve(res.token));
    });

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
  chrome.storage.local.remove(["token", "refreshToken"], () => {
    document.getElementById("status").innerText = "";
    showLoginSection();
  });
});

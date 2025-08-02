// Corrected login.js
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok && result.status === "Login successful") {
      // Save user data in localStorage if needed
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("username", result.username);
      alert("Login successful!");
      window.location.href = "index.html"; // Or dashboard
    } else {
      alert(result.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred while logging in.");
  }
});

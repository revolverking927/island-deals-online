// DOM refs
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Login fields
const logEmail = document.querySelector("#login-email");
const logPassword = document.querySelector("#login-password");
const logRole = document.querySelector("#login-role");
const logSubmit = document.querySelector("#login-submit");

// Register fields
const regName = document.querySelector("#register-name");
const regEmail = document.querySelector("#register-email");
const regPassword = document.querySelector("#register-password");
const regRole = document.querySelector("#register-role");
const regParish = document.querySelector("#register-parish");
const regCompany = document.querySelector("#register-company");
const regSubmit = document.querySelector("#register-submit");

const manufacturerFields = document.querySelector(".manufacturer-fields");

// Tab switching
loginTab.onclick = () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
};

registerTab.onclick = () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
};

// Show/hide manufacturer fields on register
regRole.addEventListener("change", () => {
  if (regRole.value === "manufacturer") {
    manufacturerFields.style.display = "block";
  } else {
    manufacturerFields.style.display = "none";
  }
});

// Helper: handle fetch responses that may redirect
async function handleResponseWithRedirect(res) {
  // If the server issued a redirect, fetch will follow it and set redirected = true,
  // and res.url will be the final URL. Use that to navigate the browser.
  if (res.redirected) {
    console.log(res);
    sessionStorage.setItem("email", regEmail.value);
   // sessionStorage.setItem("id", (lo.value || regEmail.value ? logEmail.value : regEmail.value));
    window.location.href = "/manufacturer_dashboard.html";
    return null;
  }

  // Not a redirect — parse JSON
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to parse JSON response:", err);
    return null;
  }
}

// LOGIN submission
if (logSubmit) {
  logSubmit.addEventListener('click', async () => {
    // Basic client-side validation
    if (!logEmail.value || !logPassword.value || !logRole.value) {
      alert("Please fill email, password and select role.");
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: logEmail.value,
          password: logPassword.value,
          role: logRole.value
        }),
        redirect: 'follow'
      });

      const data = await handleResponseWithRedirect(res);
      if (data && data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error("Login request failed:", err);
      alert("Login failed (network error).");
    }
  });
}

// REGISTER submission
if (regSubmit) {
  regSubmit.addEventListener('click', async () => {
    // Basic validation depending on role
    const role = regRole.value;
    if (!role || !regEmail.value || !regPassword.value) {
      alert("Please fill required fields (role, email, password).");
      return;
    }
    if (role === "consumer" && (!regName.value || !regParish.value)) {
      alert("Consumers must provide name and parish.");
      return;
    }
    if (role === "manufacturer" && !regCompany.value) {
      alert("Manufacturers must provide a company name.");
      return;
    }

    // Build body
    const body = {
      role,
      name: regName.value || null,
      parish: regParish.value || null,
      company_name: regCompany.value || null,
      email: regEmail.value,
      password: regPassword.value
    };

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        redirect: 'follow'
      });

      const data = await handleResponseWithRedirect(res);
      if (data && data.error) {
        alert(data.error);
      } else {
        // If redirected, handleResponseWithRedirect already navigated.
        // If not redirected and no error, show success.
        if (!res.redirected) {
          alert("Registration successful. Please login.");
          // switch to login tab
          loginTab.click();
        }
      }
    } catch (err) {
      console.error("Register request failed:", err);
      alert("Registration failed (network error).");
    }
  });
}

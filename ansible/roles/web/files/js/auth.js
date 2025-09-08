// Validation rules in JSON
const rules = {
  signup: {
    name: { required: true, minLength: 3 },
    email: { required: true, type: "email" },
    password: { required: true, minLength: 6, strong: true } // 👈 added strong
  },
  login: {
    email: { required: true, type: "email" },
    password: { required: true }
  }
};

// Clear all previous error messages
function clearErrors(formId) {
  $(`#${formId} .text-danger`).html("");
}

// Validate data and return field-specific errors
function validateData(data, rules) {
  const errors = {};
  for (const field in rules) {
    const value = data[field]?.trim();
    const rule = rules[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    } else if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = "Invalid email format";
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.strong && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)) {
      errors[field] = "Password must have uppercase, lowercase, and a number";
    }
  }
  return errors;
}

// Show errors under each input field
function displayErrors(errors, prefix) {
  for (const field in errors) {
    $(`#${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}Error`).html(errors[field]);
  }
}

// Handle Login
$(document).on("submit", "#loginForm", function(e) {
  e.preventDefault();
  clearErrors("loginForm");

  const data = {
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  };

  const errors = validateData(data, rules.login);
  if (Object.keys(errors).length > 0) {
    displayErrors(errors, "login");
    return;
  }

  $.ajax({
    url: "http://localhost:3000/auth/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    xhrFields: {
      withCredentials: true   // 👈 Correct way in jQuery
    }
  })
  .done(res => {
    // Show success message
    $("#loginMessage").html(`<span class="text-success">${res.message}</span>`);

    // Hide login/signup links
    $("#loginLinks, #signupLinks").hide();

    // Show user name
    $("#userDisplay").text(res.user.name);
    
  // Hide logout link, show login link
  $("#logoutNav").show();
    $("#userName").show();
  })
  .fail(err => {
    $("#loginMessage").html(`<span class="text-danger">${err.responseJSON.message}</span>`);
  });
});

// Handle Signup
$(document).on("submit", "#signupForm", function(e) {
  e.preventDefault();
  clearErrors("signupForm");

  const data = {
    name: $("#signupName").val(),
    email: $("#signupEmail").val(),
    password: $("#signupPassword").val()
  };

  const errors = "" 
  if (Object.keys(errors).length > 0) {
    displayErrors(errors, "signup");
    return;
  }

  $.ajax({
    url: "http://localhost:3000/auth/signup",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    xhrFields: {
      withCredentials: true 
    }
  })
  .done(res => {
  $("#signupMessage").html(`<span class="text-success">${res.message}</span>`);
 })
.fail(err => {
            // Split the message by comma if multiple messages are joined
        const messages = err.responseJSON.message.split('***').map(msg => msg.trim());

        console.log(messages)
        const html = '<ul class="text-danger">' + 
                     messages.map(msg => `<li>${msg}</li>`).join('') + 
                     '</ul>';

        $("#signupMessage").html(html);
    
})
});




$.ajax({
  url: "http://localhost:3000/auth/current-user",
  method: "GET",
  xhrFields: {
    withCredentials: true   // 👈 required for session cookies
  }
})
.done(res => {
  // Show success message
  $("#loginMessage").html(`<span class="text-success">Welcome back, ${res.user.name}</span>`);

  // Hide login/signup links
  $("#loginLinks, #signupLinks").hide();

  // Hide logout link, show login link
    $("#logoutNav, #userName").show();

  // Show user name
  $("#userDisplay").text(res.user.name);

})
.fail(() => {
  // Not logged in → show login/signup
  $('#loginLinks, #signupLinks').show();
  $("#logoutNav, #userName").hide();

});


    $("#logoutLink").on("click", function(e) {
      e.preventDefault(); // prevent default link behavior

      $.ajax({
        url: "http://localhost:3000/auth/logout", // your logout endpoint
        method: "POST", // safer to use POST
        xhrFields: {
          withCredentials: true // include the cookie
        }
      })
      .done(() => {
        // Hide logout link, show login link
        $("#logoutNav, #userName").hide();
          
        // show login/signup links
        $("#loginLinks, #signupLinks").show();

      })
      .fail(err => {
        console.error("Logout failed:", err);
        alert("Could not log out. Try again.");
      });
    });
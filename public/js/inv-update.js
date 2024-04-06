document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector("#updateForm");
  if (form) {
      form.addEventListener("change", function() {
          const updateBtn = form.querySelector("button");
          updateBtn.removeAttribute("disabled");
      });
  } else {
      console.log("Update form not found.");
  }

  const accountForm = document.querySelector("#updateAccountForm");
  if (accountForm) {
      accountForm.addEventListener("change", function() {
          const updateBtn = accountForm.querySelector("button");
          updateBtn.removeAttribute("disabled");
      });
  } else {
      console.log("Account update form not found.");
  }
});

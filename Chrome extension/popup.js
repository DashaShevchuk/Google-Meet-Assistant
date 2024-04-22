//popup.js
document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".btn");
  if (button) {
    button.addEventListener("click", function () {
        openIndexPage();
    });
  }
  function openIndexPage() {
    window.open("./index.html", "_blank");
  }

  function changeLanguage(language) {
    var button = document.querySelector(".btn");
    var text = document.querySelector(".little-text");
    if (language === "ua") {
      button.innerHTML = "Переглянути історію";
      text.innerHTML = "Вас вітає Google Meet Assistant";
    } else {
      button.innerHTML = "Go to history";
      text.innerHTML = "Welcome to Google Meet Assistant";
    }
  }

  function changeTheme(language) {
    var body = document.querySelector("body");
    var text = document.querySelector(".little-text");
    var content = document.querySelector(".content");
    if (language === "dark") {
      body.style.backgroundColor = "#373535";
      content.style.backgroundColor = "#373535";
      text.style.color = "whitesmoke";
    } else {
      body.style.backgroundColor = "#EEEEEE";
      content.style.backgroundColor = "#EEEEEE";
      text.style.color = "black";
    }
  }

  function handleLanguageChange() {
    var selectedLanguage = localStorage.getItem("preferredLanguage");
    if (selectedLanguage) {
      changeLanguage(selectedLanguage);
    }
  }

  function handleThemeChange() {
    var selectedTheme = localStorage.getItem("preferredTheme");
    if (selectedTheme) {
      changeTheme(selectedTheme);
    }
  }

  handleLanguageChange();
  handleThemeChange();

  window.addEventListener("themeChanged", handleThemeChange);
  window.addEventListener("themeChanged", handleThemeChange);
});

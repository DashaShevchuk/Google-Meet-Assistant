/*index.js*/
var currentPage = 1;
var currentModalPage = 1;
var itemsPerPage = localStorage.getItem("itemsPerPage") || 5;
var itemsPerModal = localStorage.getItem("itemsPerModal") || 5;
var maxVisibleButtons = 5;
var storedConferenceData = Array();

function clearTable() {
  var tableBody = document.getElementById("conferenceTableBody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

chrome.storage.local.get(["conferenceData"], function (result) {
  storedConferenceData = result.conferenceData;
  updateTable();
});

document.getElementById("itemsPerPage").addEventListener("change", function () {
  itemsPerPage = parseInt(this.value, 10);
  localStorage.setItem("itemsPerPage", itemsPerPage.toString());
  updateTable();
});

document
  .getElementById("itemsPerModal")
  .addEventListener("change", function () {
    itemsPerModal = parseInt(this.value, 10);
    localStorage.setItem("itemsPerModal", itemsPerModal.toString());
    updateParticipants();
  });

function updatePagination() {
  var totalPages = Math.ceil(storedConferenceData.length / itemsPerPage);
  var pageNumbersContainer = document.querySelector(".page-numbers");
  pageNumbersContainer.innerHTML = "";

  var startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  var endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  for (let i = startPage; i <= endPage; i++) {
    (function (pageNumber) {
      var pageNumberElement = document.createElement("span");
      pageNumberElement.classList.add("page-number");

      pageNumberElement.textContent = pageNumber;
      pageNumberElement.addEventListener("click", function () {
        currentPage = pageNumber;
        updateTable();
      });

      if (pageNumber === currentPage) {
        pageNumberElement.classList.add("current");
      }

      pageNumbersContainer.appendChild(pageNumberElement);
    })(i);
  }
}

function updateTable() {
  if (storedConferenceData.length > 0) {
    clearTable();

    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;

    storedConferenceData.slice(startIndex, endIndex).forEach((element) => {
      if (element) {
        var tableBody = document.getElementById("conferenceTableBody");
        var newRow = tableBody.insertRow();

        var cellIndex = newRow.insertCell(0);
        var cellMeetId = newRow.insertCell(1);
        var cellDate = newRow.insertCell(2);
        var cellTimeStart = newRow.insertCell(3);
        var cellTimeEnd = newRow.insertCell(4);
        var cellParticipants = newRow.insertCell(5);
        var cellDuration = newRow.insertCell(6);
        var cellAction = newRow.insertCell(7);

        const conferenceDateObject = new Date(element.conferenceDate);

        const day = conferenceDateObject.getUTCDate();
        const month = conferenceDateObject.getUTCMonth() + 1;
        const year = conferenceDateObject.getUTCFullYear();

        const formattedDate = `${day < 10 ? "0" : ""}${day}.${
          month < 10 ? "0" : ""
        }${month}.${year}`;

        const conferenceStartTimeObject = new Date(element.conferenceStartTime);
        const conferenceEndTimeObject = new Date(element.conferenceEndTime);

        const hoursStart = conferenceStartTimeObject.getHours();
        const minutesStart = conferenceStartTimeObject.getMinutes();
        const secondsStart = conferenceStartTimeObject.getSeconds();

        const hoursEnd = conferenceEndTimeObject.getHours();
        const minutesEnd = conferenceEndTimeObject.getMinutes();
        const secondsEnd = conferenceEndTimeObject.getSeconds();

        const formattedTimeStart = `${
          hoursStart < 10 ? "0" : ""
        }${hoursStart}:${minutesStart < 10 ? "0" : ""}${minutesStart}:${
          secondsStart < 10 ? "0" : ""
        }${secondsStart}`;

        const formattedTimeEnd = `${hoursEnd < 10 ? "0" : ""}${hoursEnd}:${
          minutesEnd < 10 ? "0" : ""
        }${minutesEnd}:${secondsEnd < 10 ? "0" : ""}${secondsEnd}`;

        cellIndex.textContent = tableBody.rows.length;
        cellMeetId.textContent = element.conferenceId;
        cellDate.textContent = formattedDate;
        cellTimeStart.textContent = formattedTimeStart;
        cellTimeEnd.textContent = formattedTimeEnd;
        cellDuration.textContent = element.callDuration;

        var participants = document.createElement("span");
        participants.classList.add("participants-span");
        participants.innerHTML =
          element.participants.length +
          '<img src="./icons/user-solid.svg" style="margin-left:5%;" width="20" height="30"/>';
        cellParticipants.appendChild(participants);

        var editButton = document.createElement("button");
        editButton.classList.add("table-button");
        editButton.innerHTML =
          '<img src="./icons/pen-to-square-solid.svg" width="20" height="30"/>';
        editButton.setAttribute("data-bs-toggle", "tooltip");
        editButton.setAttribute("data-bs-placement", "top");
        editButton.setAttribute("title", "Edit meeting name");
        editButton.addEventListener("click", function () {
          document.getElementById("editModal").style.display = "flex";
          document.getElementById("meetingName").defaultValue =
            element.conferenceId;
        });

        document
          .getElementById("saveChangesButton")
          .addEventListener("click", function () {
            var newName = document.getElementById("meetingName").value;
            var indexOfElementToUpdate = -1;
            for (var i = 0; i < storedConferenceData.length; i++) {
              if (
                storedConferenceData[i].conferenceId === element.conferenceId
              ) {
                indexOfElementToUpdate = i;
                break;
              }
            }
            if (indexOfElementToUpdate !== -1) {
              storedConferenceData[indexOfElementToUpdate].conferenceId =
                newName;
            }
            console.log(storedConferenceData);
            chrome.storage.local.set(
              { conferenceData: storedConferenceData },
              function () {
                document.getElementById("editModal").style.display = "none";
                updateTable();
              }
            );
          });

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("table-button");
        deleteButton.innerHTML =
          '<img src="./icons/orange-trash-solid.svg" width="20" height="30"/>';
        deleteButton.setAttribute("data-bs-toggle", "tooltip");
        deleteButton.setAttribute("data-bs-placement", "top");
        deleteButton.setAttribute("title", "Delete meeting");
        deleteButton.addEventListener("click", function () {
          document.getElementById("deleteModal").style.display = "flex";
          document.getElementById("conferenceId").innerHTML =
            element.conferenceId;
          document.getElementById("conferenceDate").innerHTML = formattedDate;
          document.getElementById("conferenceTime").innerHTML =
            formattedTimeStart;
        });
        document
          .getElementById("deleteButton")
          .addEventListener("click", function () {
            var indexOfElementToDelete = -1;
            for (var i = 0; i < storedConferenceData.length; i++) {
              if (
                storedConferenceData[i].conferenceId === element.conferenceId
              ) {
                indexOfElementToDelete = i;
                break;
              }
            }
            if (indexOfElementToDelete !== -1) {
              storedConferenceData.pop(
                storedConferenceData[indexOfElementToDelete]
              );
            }
            chrome.storage.local.set(
              { conferenceData: storedConferenceData },
              function () {
                document.getElementById("deleteModal").style.display = "none";
                updateTable();
              }
            );
          });

        var showParticipantsButton = document.createElement("button");
        showParticipantsButton.classList.add("table-button");
        showParticipantsButton.innerHTML =
          '<img src="./icons/users-solid.svg" width="20" height="30"/>';
        showParticipantsButton.setAttribute("data-bs-toggle", "tooltip");
        showParticipantsButton.setAttribute("data-bs-placement", "top");
        showParticipantsButton.setAttribute("title", "Show participants");
        function goToPreviousPageModal() {
          if (currentModalPage > 1) {
            currentModalPage--;
            updateParticipants();
          }
        }

        function goToNextPageModal() {
          var totalPages = Math.ceil(
            element.participants.length / itemsPerModal
          );
          if (currentModalPage < totalPages) {
            currentModalPage++;
            updateParticipants();
          }
        }

        document
          .querySelector(".prev-modal")
          .addEventListener("click", goToPreviousPageModal);
        document
          .querySelector(".next-modal")
          .addEventListener("click", goToNextPageModal);

        function updateModalPagination() {
          var totalPages = Math.ceil(
            storedConferenceData[currentPage - 1].participants.length /
              itemsPerModal
          );
          var pageNumbersContainer = document.getElementById(
            "participantsPagination"
          );
          pageNumbersContainer.innerHTML = "";

          var startPage = Math.max(
            1,
            currentModalPage - Math.floor(maxVisibleButtons / 2)
          );
          var endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

          for (let i = startPage; i <= endPage; i++) {
            (function (pageNumber) {
              var pageNumberElement = document.createElement("span");
              pageNumberElement.classList.add("page-number");

              pageNumberElement.textContent = pageNumber;
              pageNumberElement.addEventListener("click", function () {
                currentModalPage = pageNumber;
                updateParticipants();
              });

              if (pageNumber === currentModalPage) {
                pageNumberElement.classList.add("current");
              }

              pageNumbersContainer.appendChild(pageNumberElement);
            })(i);
          }
        }

        function updateParticipants() {
          document.getElementById("participantsModal").style.display = "flex";
          var startIndex = (currentModalPage - 1) * itemsPerModal;
          var endIndex = startIndex + itemsPerModal;

          element.participants
            .slice(startIndex, endIndex)
            .forEach((participant) => {
              if (participant) {
                var participantsTableBody = document.getElementById(
                  "participantsTableBody"
                );
                var newRow = participantsTableBody.insertRow();

                var cellIndex = newRow.insertCell(0);
                var cellImage = newRow.insertCell(1);
                var cellName = newRow.insertCell(2);
                var cellTimeInConference = newRow.insertCell(3);
                var cellTimeWithCamera = newRow.insertCell(4);

                cellIndex.textContent = participantsTableBody.rows.length;
                cellName.textContent = participant.name;
                cellTimeInConference.textContent = participant.timeInConference;
                cellTimeWithCamera.textContent = participant.videoTime;

                var image = document.createElement("img");
                image.classList.add("participant-image");
                image.setAttribute("src", participant.image);
                image.setAttribute("width", 60);
                image.setAttribute("height", 60);

                cellImage.appendChild(image);
              }
            });
        }

        showParticipantsButton.addEventListener("click", updateParticipants);

        cellAction.appendChild(editButton);
        cellAction.appendChild(deleteButton);
        cellAction.appendChild(showParticipantsButton);

        cellAction.classList.add("d-flex", "justify-content-center");

        updateModalPagination();
      }
    });
  }
  updatePagination();
}
document.getElementById("closeEdit").addEventListener("click", function () {
  document.getElementById("editModal").style.display = "none";
});
document.getElementById("closeDelete").addEventListener("click", function () {
  document.getElementById("deleteModal").style.display = "none";
});
document
  .getElementById("closeParticipants")
  .addEventListener("click", function () {
    document.getElementById("participantsModal").style.display = "none";
    document.getElementById("participantsTableBody").innerHTML = " ";
  });
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
}

function goToNextPage() {
  var totalPages = Math.ceil(storedConferenceData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable();
  }
}

document.querySelector(".prev").addEventListener("click", goToPreviousPage);
document.querySelector(".next").addEventListener("click", goToNextPage);

document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("conferenceData", function () {
      clearTable();
    });
  });

document.getElementById("themeSwitch").addEventListener("click", toggleTheme);
document
  .getElementById("languageSwitch")
  .addEventListener("click", toggleLanguage);

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("theme", newTheme);
  updatePageTheme(newTheme);

  const themeSwitchButton = document.getElementById("themeSwitch");
  const moonIconPath = "./icons/moon-solid.svg";
  const sunIconPath = "./icons/sun-solid.svg";
  const currentIconPath = themeSwitchButton.querySelector("img").src;

  if (currentIconPath.includes("moon")) {
    themeSwitchButton.querySelector("img").src = sunIconPath;
  } else {
    themeSwitchButton.querySelector("img").src = moonIconPath;
  }

  localStorage.setItem("preferredTheme", newTheme);
}

function toggleLanguage() {
  const body = document.body;
  const currentLang = body.getAttribute("lang");
  const newLang = currentLang === "gb" ? "ua" : "gb";

  body.setAttribute("lang", newLang);
  updatePageText(newLang);

  const languageSwitchButton = document.getElementById("languageSwitch");
  const gbIconPath = "./icons/gb.svg";
  const uaIconPath = "./icons/ua.svg";
  const currentIconPath = languageSwitchButton.querySelector("img").src;

  if (currentIconPath.includes("gb")) {
    languageSwitchButton.querySelector("img").src = uaIconPath;
  } else {
    languageSwitchButton.querySelector("img").src = gbIconPath;
  }

  localStorage.setItem("preferredLanguage", newLang);
}

function updatePageText(lang) {
  const littleTextElement = document.querySelector(".little-text");
  const clearTableButton = document.getElementById("clearLocalStorageButton");
  const conferencesTableHeaders = document.querySelectorAll(
    "#conferencesTable thead th"
  );

  const meetingNameLabel = document.querySelector(
    "#editModal .input-container label"
  );
  const saveChangesButton = document.getElementById("saveChangesButton");
  const deleteButton = document.getElementById("deleteButton");
  const deletePrefix = document.getElementById("deletePrefix");
  const deleteMiddle = document.getElementById("deleteMiddle");
  const deleteSuffix = document.getElementById("deleteSuffix");
  const participantsTableHeaders = document.querySelectorAll(
    "#participantsTable thead th"
  );

  if (lang === "ua") {
    littleTextElement.textContent = "Керуйте своїми конференціями з нами";

    clearTableButton.innerHTML =
      "Очистити таблицю" +
      '<img src="./icons/trash-solid-2.svg" width="20" height="30">';

    const uadefaultConferencesTableHeaders = [
      "#",
      "Ім'я",
      "Дата",
      "Початок",
      "Кінець",
      "Учасники",
      "Тривалість",
      "Дія",
    ];
    conferencesTableHeaders.forEach((header, index) => {
      header.textContent = uadefaultConferencesTableHeaders[index];
    });

    meetingNameLabel.textContent = "Нова назва зустрічі: ";

    saveChangesButton.textContent = "Зберегти";

    deleteButton.textContent = "Видалити";

    deletePrefix.textContent = "Ви впевненні що хочете видалити ";
    deleteMiddle.textContent = " з ";
    deleteSuffix.textContent = "";

    const uadefaultParticipantsTableHeaders = [
      "#",
      "Фото",
      "Ім'я",
      "Час у коференції",
      "Час з камерою",
    ];
    participantsTableHeaders.forEach((header, index) => {
      header.textContent = uadefaultParticipantsTableHeaders[index];
    });
  } else {
    littleTextElement.textContent = "Controll your conferences with us";

    clearTableButton.innerHTML =
      "Clear table" +
      '<img src="./icons/trash-solid-2.svg" width="20" height="30">';

    const defaultConferencesTableHeaders = [
      "#",
      "Name",
      "Date",
      "Time start",
      "Time end",
      "Participants",
      "Duration",
      "Action",
    ];
    conferencesTableHeaders.forEach((header, index) => {
      header.textContent = defaultConferencesTableHeaders[index];
    });

    meetingNameLabel.textContent = "New meeting name :";

    saveChangesButton.textContent = "Save";

    deleteButton.textContent = "Delete";

    deletePrefix.textContent = "Are you sure you want to delete ";
    deleteMiddle.textContent = " from ";
    deleteSuffix.textContent = "";

    const defaultParticipantsTableHeaders = [
      "#",
      "Image",
      "Name",
      "Time in conference",
      "Time with camera",
    ];
    participantsTableHeaders.forEach((header, index) => {
      header.textContent = defaultParticipantsTableHeaders[index];
    });
  }
}

function updatePageTheme(theme) {
  const body = document.querySelector("body");
  const navbar = document.querySelector(".navbar");
  const littleText = document.querySelector(".little-text");
  const tables = document.querySelectorAll("table");
  const conferencesTableHeaders = document.querySelectorAll(
    "#conferencesTable thead th"
  );
  const conferencesTableRows = document.querySelectorAll(
    "#conferencesTable tbody tr"
  );
  const participantsTableHeaders = document.querySelectorAll(
    "#participantsTable thead th"
  );
  const participantsTableRows = document.querySelectorAll(
    "#participantsTableBody"
  );
  console.log("headers", participantsTableHeaders);
  console.log("rows", participantsTableRows);
  const paginations = document.querySelectorAll(".pagination-container");
  const itemsPerPage = document.getElementById("itemsPerPage");
  const itemsPerPageModal = document.getElementById("itemsPerModal");
  const modalContent = document.querySelectorAll(".modal-content");
  const meetingName = document.querySelector('label[for="meetingName"]');
  const deleteText = document.querySelector(".text-container");

  if (theme === "dark") {
    body.style.backgroundColor = "#1c1c1c";
    navbar.style.backgroundColor = "#373535";
    littleText.style.color = "whitesmoke";

    tables.forEach((table) => {
      table.style.backgroundColor = "#373535";
    });

    conferencesTableHeaders.forEach((header) => {
      header.style.color = "whitesmoke";
    });

    conferencesTableRows.forEach((row) => {
      row.style.color = "whitesmoke";
    });

    participantsTableHeaders.forEach((header) => {
      header.style.color = "whitesmoke";
    });

    participantsTableRows.forEach((row) => {
      row.style.color = "whitesmoke";
    });
    paginations.forEach((pagination) => {
      pagination.style.backgroundColor = "#373535";
    });
    itemsPerPage.style.backgroundColor = "#373535";
    itemsPerPageModal.style.backgroundColor = "#373535";
    modalContent.forEach((modal) => {
      modal.style.backgroundColor = "#373535";
    });
    meetingName.style.color = "whitesmoke";
    deleteText.style.color = "whitesmoke";
  } else {
    body.style.backgroundColor = "#EEEEEE";
    navbar.style.backgroundColor = "white";
    littleText.style.color = "black";
    tables.forEach((table) => {
      table.style.backgroundColor = "white";
    });
    conferencesTableHeaders.forEach((header) => {
      header.style.color = "black";
    });
    conferencesTableRows.forEach((row) => {
      row.style.color = "black";
    });
    participantsTableHeaders.forEach((header) => {
      header.style.color = "black";
    });
    participantsTableRows.forEach((row) => {
      row.style.color = "black";
    });
    paginations.forEach((pagination) => {
      pagination.style.backgroundColor = "white";
    });
    itemsPerPage.style.backgroundColor = "white";
    itemsPerPageModal.style.backgroundColor = "white";
    modalContent.forEach((modal) => {
      modal.style.backgroundColor = "white";
    });
    meetingName.style.color = "black";
    deleteText.style.color = "black";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const savedLang = localStorage.getItem("preferredLanguage");
  if (savedLang) {
    const body = document.body;
    body.setAttribute("lang", savedLang);
    updatePageText(savedLang);

    const languageSwitchButton = document.getElementById("languageSwitch");
    const gbIconPath = "./icons/gb.svg";
    const uaIconPath = "./icons/ua.svg";

    if (savedLang === "ua") {
      languageSwitchButton.querySelector("img").src = uaIconPath;
    } else {
      languageSwitchButton.querySelector("img").src = gbIconPath;
    }
  }

  const savedTheme = localStorage.getItem("preferredTheme");
  if (savedTheme) {
    const body = document.body;
    body.setAttribute("theme", savedTheme);
    updatePageTheme(savedTheme);

    const themeSwitchButton = document.getElementById("themeSwitch");
    const moonIconPath = "./icons/moon-solid.svg";
    const sunIconPath = "./icons/sun-solid.svg";

    if (savedTheme === "dark") {
      themeSwitchButton.querySelector("img").src = moonIconPath;
    } else {
      themeSwitchButton.querySelector("img").src = sunIconPath;
    }
  }
});

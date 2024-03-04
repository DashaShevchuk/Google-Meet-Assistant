/*index.js*/
chrome.storage.local.get(["conferenceData"], function (result) {
  var storedConferenceData = result.conferenceData;

  if (storedConferenceData) {
    storedConferenceData.forEach((element) => {
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

        const hoursStart = conferenceStartTimeObject.getUTCHours();
        const minutesStart = conferenceStartTimeObject.getUTCMinutes();
        const secondsStart = conferenceStartTimeObject.getUTCSeconds();

        const hoursEnd = conferenceEndTimeObject.getUTCHours();
        const minutesEnd = conferenceEndTimeObject.getUTCMinutes();
        const secondsEnd = conferenceEndTimeObject.getUTCSeconds();

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
        participants.innerHTML =
          element.participants.length + '<i class="bi bi-person"></i>';
        cellParticipants.appendChild(participants);

        var editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-outline-primary", "m-1");
        editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editButton.setAttribute("data-bs-toggle", "tooltip");
        editButton.setAttribute("data-bs-placement", "top");
        editButton.setAttribute("title", "Edit meeting name");
        editButton.addEventListener("click", function () {});

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-outline-primary", "m-1");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.setAttribute("data-bs-toggle", "tooltip");
        deleteButton.setAttribute("data-bs-placement", "top");
        deleteButton.setAttribute("title", "Delete meeting");
        deleteButton.addEventListener("click", function () {});

        var showParticipantsButton = document.createElement("button");
        showParticipantsButton.classList.add(
          "btn",
          "btn-outline-primary",
          "m-1"
        );
        showParticipantsButton.innerHTML = '<i class="bi bi-people"></i>';
        showParticipantsButton.setAttribute("data-bs-toggle", "tooltip");
        showParticipantsButton.setAttribute("data-bs-placement", "top");
        showParticipantsButton.setAttribute("title", "Show participants");
        showParticipantsButton.addEventListener("click", function () {});

        cellAction.appendChild(editButton);
        cellAction.appendChild(deleteButton);
        cellAction.appendChild(showParticipantsButton);

        cellAction.classList.add("d-flex", "justify-content-center");
      }
    });
  }
});

document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("conferenceData", function () {
      var tableBody = document.getElementById("conferenceTableBody");
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
      }
    });
  });

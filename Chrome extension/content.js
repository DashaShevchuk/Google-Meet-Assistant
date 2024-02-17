let conferenceId = null;
let conferenceStartTime = null;
let conferenceEndTime = null;
let conferenceDate = null;
let callDuration = null;
let participantsArray = [];
let eventListenerAdded = false;
let hasLogged = false;

class ParticipantData {
  constructor(name, image, timeJoining, timeInConference, statusOnConference) {
    this.name = name;
    this.image = image;
    this.timeJoining = timeJoining;
    this.timeInConference = timeInConference;
    this.statusOnConference = statusOnConference;
  }
}

function sendData(status) {
  const dataToSend = {
    conferenceId: conferenceId,
    conferenceStartTime: conferenceStartTime,
    conferenceDate: conferenceDate,
    status: status,
    participants: participantsArray,
    conferenceEndTime: conferenceEndTime,
    callDuration: callDuration,
  };

  chrome.runtime.sendMessage(dataToSend);
}

function getStartedConferenceData() {
  const now = new Date();
  conferenceStartTime = now;
  conferenceDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  sendData("start");
}

const endConferenceButtonClick = function () {
  const now = new Date();
  conferenceEndTime = now;
  callDuration = calculateDuration(conferenceStartTime, conferenceEndTime);
  participantsArray.forEach((element) => {
    if (element.statusOnConference == "present") {
      if (element.timeInConference == null) {
        element.timeInConference = calculateDuration(
          element.timeJoining,
          conferenceEndTime
        );
      } else {
        const newTimeInConference = calculateDuration(
          element.timeJoining,
          conferenceEndTime
        );
        element.timeInConference = addDurations(
          element.timeInConference,
          newTimeInConference
        );
      }
    }
  });

  sendData("end");
  eventListenerAdded = true;
};

function addPartisipant(name, image, timeJoining) {
  const participantData = new ParticipantData(
    name,
    image,
    timeJoining,
    null,
    "present"
  );
  participantsArray.push(participantData);
  sendData("in progress");
}

if (window.location.href.includes("meet.google.com")) {
  conferenceId = window.location.pathname.split("/").pop();
  const localStorageKey = `conferenceStarted_${conferenceId}`;

  if (window.location.href.includes(conferenceId)) {
    if (!localStorage.getItem(localStorageKey)) {
      getStartedConferenceData();
      localStorage.setItem(localStorageKey, true);
    }

    const checkHost = setInterval(() => {
      const hostName = document.querySelector(".dwSJ2e");
      const hostImage = document.querySelector('img[jscontroller="PcYCFc"]');

      if (hostName && hostImage) {
        addPartisipant(
          hostName.innerHTML,
          hostImage.getAttribute("src"),
          conferenceStartTime
        );
        clearInterval(checkHost);
      }
    }, 1000);

 setInterval(() => {
      const participantLeaveElement = document.querySelector(".VfPpkd-gIZMF");
    
      if (
        participantLeaveElement &&
        window.getComputedStyle(participantLeaveElement).display !== "none"
      ) {
        const exitElementText = participantLeaveElement.textContent;
        if (!hasLogged) {
          const hasParticipantLeft = participantsArray.some((element) => {
            if (
              (exitElementText.includes("has left the meeting") ||
                exitElementText.includes("залишає зустріч"))
            ) {
              let wordsWithCapitalLetters = [];
    
              let words = exitElementText.split(" ");
      
              for (let i = 0; i < words.length; i++) {
                let word = words[i];
                if (/^\p{Lu}/u.test(word)) {
                  wordsWithCapitalLetters.push(word);
                }
              }
      
              const leftUser = wordsWithCapitalLetters.join(" ");
    if(element.name === leftUser){
              if (element.timeInConference == null) {
                const now = new Date();
                element.timeInConference = calculateDuration(
                  element.timeJoining,
                  now
                );
              } else {
                const now = new Date();
                const newDuration = calculateDuration(element.timeJoining, now);
                element.timeInConference = addDurations(
                  element.timeInConference,
                  newDuration
                );
              }
              element.statusOnConference = "absent";
              return true;
            }
            return false;
        }});
    
          if (hasParticipantLeft) {
            hasLogged = true;
          }
        }
      } else {
        hasLogged = false;
      }
    }, 1000);

    setInterval(() => {
      const userEddingMessage = document.querySelector('[jsname="Ota2jd"]');

      if (userEddingMessage != null) {
        const newUserNameElement = document.querySelector(".md2Vmc");

        if (newUserNameElement) {
          const newUserImageElement = document.querySelector(
            'img[jsname="YLEF4c"]'
          );

          const newUserNameElementText = newUserNameElement.innerHTML;
          let wordsWithCapitalLetters = [];

          let words = newUserNameElementText.split(" ");

          for (let i = 0; i < words.length; i++) {
            let word = words[i];
            if (/^\p{Lu}/u.test(word)) {
              wordsWithCapitalLetters.push(word);
            }
          }

          const newUserName = wordsWithCapitalLetters.join(" ");
          const newUserImage = newUserImageElement.getAttribute("src");

          if (newUserName && newUserImage) {
            const isUniqueParticipant = !participantsArray.some(
              (existingParticipant) =>
                existingParticipant.name === newUserName &&
                existingParticipant.image === newUserImage
            );

            if (isUniqueParticipant) {
              const now = new Date();
              addPartisipant(newUserName, newUserImage, now);
            } else {
              participantsArray.forEach((element) => {
                if (
                  element.name == newUserName &&
                  element.image == newUserImage
                ) {
                  const now = new Date();
                  element.timeJoining = now;
                  element.statusOnConference = "present";
                }
              });
            }
          }
        }
      }
    }, 1000);

    const checkEndCallButton = setInterval(() => {
      const endCallButton = document.querySelector(
        'button[data-tooltip-id="tt-c34"]'
      );
      if (endCallButton && !eventListenerAdded) {
        clearInterval(checkEndCallButton);
        endCallButton.addEventListener("click", endConferenceButtonClick);
      }
    }, 1000);
  }
}

function calculateDuration(startTime, endTime) {
  let duration = Math.abs(startTime - endTime);
  const hours = Math.floor(duration / 3600000);
  duration -= hours * 3600000;
  const minutes = Math.floor(duration / 60000);
  duration -= minutes * 60000;
  const seconds = Math.floor(duration / 1000);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
}

function addDurations(time1, time2) {
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

  const totalHours = hours1 + hours2;
  const totalMinutes = minutes1 + minutes2;
  const totalSeconds = seconds1 + seconds2;

  const extraMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const finalMinutes = totalMinutes + extraMinutes;

  const extraHours = Math.floor(finalMinutes / 60);
  const remainingMinutes = finalMinutes % 60;
  const finalHours = totalHours + extraHours;

  const formattedHours = String(finalHours).padStart(2, "0");
  const formattedMinutes = String(remainingMinutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

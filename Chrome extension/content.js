let conferenceId = null;
let conferenceStartTime = null;
let conferenceEndTime = null;
let conferenceDate = null;
let callDuration = null;
let participantsArray = [];
let eventListenerAdded = false;
let hasLogged = false;
let isVideoPlaying = false;

class ParticipantData {
  constructor(
    name,
    image,
    timeJoining,
    timeInConference,
    statusOnConference,
    videoTime,
    videoTimeStarted,
    videoTimeEnded,
    isVideoPlaying
  ) {
    this.name = name;
    this.image = image;
    this.timeJoining = timeJoining;
    this.timeInConference = timeInConference;
    this.statusOnConference = statusOnConference;

    this.videoTimeStarted = videoTimeStarted;
    this.videoTimeEnded = videoTimeEnded;
    this.videoTime = videoTime;
    this.isVideoPlaying = isVideoPlaying;
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
function findImageByVideo(videoElement) {
  let parentDiv = videoElement.parentNode.parentNode.parentNode;
  if (parentDiv) {
    let img = parentDiv.querySelector("img");
    if (img) {
      return img.getAttribute("src");
    }
  }
}

function getImagePathWithoutSize(path) {
  if (path) {
    let newPath = path.replace(/=s\d+-p-k-no-mo$/, "");
    return newPath;
  }
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
      if (element.videoTime === null) {
        element.videoTime = calculateDuration(
          element.videoTimeStarted,
          conferenceEndTime
        );
        element.isVideoPlaying = false;
      } else {
        const newDuration = calculateDuration(
          element.videoTimeStarted,
          conferenceEndTime
        );
        element.videoTime = addDurations(element.videoTime, newDuration);
        element.isVideoPlaying = false;
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
    "present",
    null,
    null,
    null,
    false
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
              exitElementText.includes("has left the meeting") ||
              exitElementText.includes("залишає зустріч")
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
              if (element.name === leftUser) {
                if (element.timeInConference == null) {
                  const now = new Date();
                  element.timeInConference = calculateDuration(
                    element.timeJoining,
                    now
                  );
                } else {
                  const now = new Date();
                  const newDuration = calculateDuration(
                    element.timeJoining,
                    now
                  );
                  element.timeInConference = addDurations(
                    element.timeInConference,
                    newDuration
                  );
                }
                element.statusOnConference = "absent";
                return true;
              }
              return false;
            }
          });

          if (hasParticipantLeft) {
            hasLogged = true;
          }
        }
      } else {
        hasLogged = false;
      }
    }, 1000);

    setInterval(() => {
      let visibleVideos = document.querySelectorAll(
        "video:not([style*='display: none'])"
      );

      let hiddenVideos = document.querySelectorAll(
        "video[style*='display: none']"
      );

      visibleVideos.forEach((videoElement) => {
        let img = findImageByVideo(videoElement);
        let imagePath = getImagePathWithoutSize(img);
        if (img) {
          participantsArray.forEach((participant) => {
            let participantImagePath = getImagePathWithoutSize(
              participant.image
            );
            if (
              participant.isVideoPlaying == false &&
              participantImagePath === imagePath
            ) {
              const now = new Date();
              participant.isVideoPlaying = true;
              participant.videoTimeStarted = now;
            }
          });
        }
      });

      hiddenVideos.forEach((hiddenVideoElement) => {
        let dataUid = hiddenVideoElement.getAttribute("data-uid");

        let isUidPresent = Array.from(visibleVideos).some(
          (visibleVideoElement) => {
            return visibleVideoElement.getAttribute("data-uid") === dataUid;
          }
        );

        if (!isUidPresent) {
          let img = findImageByVideo(hiddenVideoElement);
          let imagePath = getImagePathWithoutSize(img);
          if (img) {
            participantsArray.forEach((participant) => {
              let participantImagePath = getImagePathWithoutSize(
                participant.image
              );
              if (
                participant.isVideoPlaying == true &&
                participantImagePath === imagePath
              ) {
                const now = new Date();
                participant.videoTimeEnded = now;
                participant.isVideoPlaying = false;
                if (participant.videoTime == null) {
                  participant.videoTime = calculateDuration(
                    participant.videoTimeStarted,
                    participant.videoTimeEnded
                  );
                  participant.isVideoPlaying = false;
                } else {
                  const newDuration = calculateDuration(
                    participant.videoTimeStarted,
                    participant.videoTimeEnded
                  );
                  participant.videoTime = addDurations(participant.videoTime, newDuration);
                  participant.isVideoPlaying = false;
                }
              }
            });
          }
        }
      });
    }, 1000);

    setInterval(() => {
      const userEddingMessage = document.querySelector('[jsname="Ota2jd"]');

      if (userEddingMessage != null) {
        const newUserNameElement = document.querySelector(".md2Vmc");

        if (newUserNameElement) {
          const newUserImageElement = document.querySelector(
            'img[class="qg7mD r6DyN  JBY0Kc"]'
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
                existingParticipant.name == newUserName &&
                existingParticipant.image == newUserImage
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
        'button[jsname="CQylAd"]'
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
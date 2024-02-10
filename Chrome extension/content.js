//ABSOLUTLY WORKING
let conferenceId = null;
let conferenceStartTime = null;
let conferenceEndTime = null;
let conferenceDate = null;
let eventListenerAdded = false;
let callDuration = null;
let participantsArray = [];

if (window.location.href.includes("meet.google.com")) {
  conferenceId = window.location.pathname.split("/").pop();

  if (window.location.href.includes(conferenceId)) {
    const checkConferenceStart = setInterval(() => {
      const now = new Date();

      conferenceStartTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear();

      const conferenceDate = `${day}.${month}.${year}`;
      const dataToSendStart = {
        conferenceId: conferenceId,
        conferenceStartTime: conferenceStartTime,
        conferenceDate: conferenceDate,
        status: "start",
      };

      chrome.runtime.sendMessage(dataToSendStart);
      clearInterval(checkConferenceStart);
    }, 1000);

    const checkEndCallButton = setInterval(() => {
      const endCallButton = document.querySelector(
        'button[data-tooltip-id="tt-c34"]'
      );
      if (endCallButton && !eventListenerAdded) {
        clearInterval(checkEndCallButton);

        const handleClick = function () {
          const now = new Date();
          conferenceEndTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
          callDuration = calculateDuration(
            conferenceStartTime,
            conferenceEndTime
          );

          const dataToSendEnd = {
            conferenceId: conferenceId,
            conferenceStartTime: conferenceStartTime,
            conferenceDate: conferenceDate,
            status: "end",
            participants: participantsArray,
            conferenceEndTime: conferenceEndTime,
            callDuration: callDuration,
          };

          chrome.runtime.sendMessage(dataToSendEnd);

          eventListenerAdded = true;
        };

        endCallButton.addEventListener("click", handleClick);
      }
    }, 1000);

    setInterval(() => {
      const participants = document.querySelectorAll(".dkjMxf");
      participants.forEach((participant, index) => {
        const nameElement = participant.querySelector(".dwSJ2e");
        const imageElement = participant.querySelector(
          'img[jscontroller="PcYCFc"]'
        );

        if (nameElement && imageElement) {
          const participantData = {
            name: nameElement.innerHTML,
            image: imageElement.getAttribute("src"),
          };

          // Check for uniqueness based on both name and image
          const isUniqueParticipant = !participantsArray.some(
            (existingParticipant) =>
              existingParticipant.name === participantData.name &&
              existingParticipant.image === participantData.image
          );

          if (isUniqueParticipant) {
            participantsArray.push(participantData);
            console.log("Added new participant:", participantData);
            const dataToSend = {
              conferenceId: conferenceId,
              conferenceStartTime: conferenceStartTime,
              conferenceDate: conferenceDate,
              status: "In progres",
              participants: participantsArray,
              conferenceEndTime: conferenceEndTime,
              callDuration: callDuration,
            };
            chrome.runtime.sendMessage(dataToSend);
          }
        }
      });
    }, 1000);
  }
}

function calculateDuration(startTime, endTime) {
  const start = new Date(`2000/01/01 ${startTime}`);
  const end = new Date(`2000/01/01 ${endTime}`);
  const duration = new Date(end - start);

  const hours = duration.getUTCHours();
  const minutes = duration.getUTCMinutes();
  const seconds = duration.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
}

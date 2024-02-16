//ABSOLUTLY WORKING

// let conferenceId = null;
// let conferenceStartTime = null;
// let conferenceEndTime = null;
// let conferenceDate = null;
// let callDuration = null;
// let participantsArray = [];
// let eventListenerAdded = false;

// class ParticipantData {
//   constructor(name, image, timeJoing) {
//     this.name = name;
//     this.image = image;
//     this.timeJoing = timeJoing;
//     this.timeInConference=null;
//   }
// }

// if (window.location.href.includes("meet.google.com")) {

//   conferenceId = window.location.pathname.split("/").pop();
//   const localStorageKey = `conferenceStarted_${conferenceId}`;

//   if (window.location.href.includes(conferenceId)) {

//     if (!localStorage.getItem(localStorageKey)) {
//       const now = new Date();
//       conferenceStartTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       const day = now.getDate().toString().padStart(2, "0");
//       const month = (now.getMonth() + 1).toString().padStart(2, "0");
//       const year = now.getFullYear();
//       conferenceDate = `${day}.${month}.${year}`;

//       const dataToSendStart = {
//         conferenceId: conferenceId,
//         conferenceStartTime: conferenceStartTime,
//         conferenceDate: conferenceDate,
//         status: "start",
//       };

//       chrome.runtime.sendMessage(dataToSendStart);

//       localStorage.setItem(localStorageKey, true);
//     }

//     const checkEndCallButton = setInterval(() => {
//       const endCallButton = document.querySelector(
//         'button[data-tooltip-id="tt-c34"]'
//       );
//       if (endCallButton && !eventListenerAdded) {
//         clearInterval(checkEndCallButton);
//         const handleClick = function () {

//           const now = new Date();
//       conferenceEndTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       callDuration = calculateDuration(conferenceStartTime, conferenceEndTime);

//           participantsArray.forEach((element)=>{
//             if(element.timeInConference == null){
//               element.timeInConference = calculateDuration(element.timeJoing, conferenceEndTime);
//             }
//           })

//           const dataToSendEnd = {
//             conferenceId: conferenceId,
//             conferenceStartTime: conferenceStartTime,
//             conferenceDate: conferenceDate,
//             status: "end",
//             participants: participantsArray,
//             conferenceEndTime: conferenceEndTime,
//             callDuration: callDuration,
//           };
//           chrome.runtime.sendMessage(dataToSendEnd);
//           eventListenerAdded = true;
//         };

//         endCallButton.addEventListener("click", handleClick);
//       }
//     }, 1000);

//     setInterval(() => {
//       const participants = document.querySelectorAll(".dkjMxf");

//       participants.forEach((participant, index) => {
//         const nameElement = participant.querySelector(".dwSJ2e");
//         const imageElement = participant.querySelector(
//           'img[jscontroller="PcYCFc"]'
//         );

//         if (nameElement && imageElement) {
//          const now = new Date();
//         const participantData = new ParticipantData(
//           nameElement.innerHTML,
//           imageElement.getAttribute("src"),
//           `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
//         );

//           const isUniqueParticipant = !participantsArray.some(
//             (existingParticipant) =>
//               existingParticipant.name === participantData.name &&
//               existingParticipant.image === participantData.image
//           );

//           if (isUniqueParticipant) {
//             participantsArray.push(participantData);
//             const dataToSendInProgress = {
//               conferenceId: conferenceId,
//               conferenceStartTime: conferenceStartTime,
//               conferenceDate: conferenceDate,
//               status: "In progres",
//               participants: participantsArray,
//               conferenceEndTime: conferenceEndTime,
//               callDuration: callDuration,
//             };
//             chrome.runtime.sendMessage(dataToSendInProgress);
//           }
//         }
//       });
//     }, 1000);
//     setInterval(() => {
//       const participantLeaveElement = document.querySelector(".VfPpkd-gIZMF");

//       if (
//         participantLeaveElement &&
//         window.getComputedStyle(participantLeaveElement).display !== "none"
//       ) {
//         const exitElementText =
//           participantLeaveElement.textContent.toLowerCase();

//         participantsArray.forEach((element) => {
//           const elementName = element.name.toLowerCase();

//           const words = exitElementText.split(" ");
//           const firstWords = words
//             .slice(0, elementName.split(" ").length)
//             .join(" ");

//           if (firstWords === elementName) {
//             console.log(element);
//             const now = new Date();
//             const leaveTime =  `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//     element.timeInConference=calculateDuration(element.timeJoing, leaveTime);
//           }
//         });
//       }
//     }, 1000);
//   }
// }

// function calculateDuration(startTime, endTime) {
//   const start = new Date(`2000/01/01 ${startTime}`);
//   const end = new Date(`2000/01/01 ${endTime}`);
//   const duration = new Date(end - start);

//   const hours = duration.getUTCHours();
//   const minutes = duration.getUTCMinutes();
//   const seconds = duration.getUTCSeconds();

//   return `${hours}:${minutes}:${seconds}`;
// }

// let conferenceId = null;
// let conferenceStartTime = null;
// let conferenceEndTime = null;
// let conferenceDate = null;
// let callDuration = null;
// let participantsArray = [];
// let eventListenerAdded = false;

// class ParticipantData {
//   constructor(name, image, timeJoing) {
//     this.name = name;
//     this.image = image;
//     this.timeJoing = timeJoing;
//     this.timeInConference=null;
//   }
// }

// if (window.location.href.includes("meet.google.com")) {

//   conferenceId = window.location.pathname.split("/").pop();
//   const localStorageKey = `conferenceStarted_${conferenceId}`;

//   if (window.location.href.includes(conferenceId)) {

//     if (!localStorage.getItem(localStorageKey)) {
//       const now = new Date();
//       conferenceStartTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       const day = now.getDate().toString().padStart(2, "0");
//       const month = (now.getMonth() + 1).toString().padStart(2, "0");
//       const year = now.getFullYear();
//       conferenceDate = `${day}.${month}.${year}`;

//       const dataToSendStart = {
//         conferenceId: conferenceId,
//         conferenceStartTime: conferenceStartTime,
//         conferenceDate: conferenceDate,
//         status: "start",
//       };

//       chrome.runtime.sendMessage(dataToSendStart);

//       localStorage.setItem(localStorageKey, true);
//     }

//     const checkEndCallButton = setInterval(() => {
//       const endCallButton = document.querySelector(
//         'button[data-tooltip-id="tt-c34"]'
//       );
//       if (endCallButton && !eventListenerAdded) {
//         clearInterval(checkEndCallButton);
//         const handleClick = function () {

//           const now = new Date();
//       conferenceEndTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       callDuration = calculateDuration(conferenceStartTime, conferenceEndTime);

//           participantsArray.forEach((element)=>{
//             if(element.timeInConference == null){
//               element.timeInConference = calculateDuration(element.timeJoing, conferenceEndTime);
//             }
//           })

//           const dataToSendEnd = {
//             conferenceId: conferenceId,
//             conferenceStartTime: conferenceStartTime,
//             conferenceDate: conferenceDate,
//             status: "end",
//             participants: participantsArray,
//             conferenceEndTime: conferenceEndTime,
//             callDuration: callDuration,
//           };
//           chrome.runtime.sendMessage(dataToSendEnd);
//           eventListenerAdded = true;
//         };

//         endCallButton.addEventListener("click", handleClick);
//       }
//     }, 1000);

//     setInterval(() => {
//       const participants = document.querySelectorAll(".dkjMxf");

//       participants.forEach((participant, index) => {
//         const nameElement = participant.querySelector(".dwSJ2e");
//         const imageElement = participant.querySelector(
//           'img[jscontroller="PcYCFc"]'
//         );

//         if (nameElement && imageElement) {
//          const now = new Date();
//         const participantData = new ParticipantData(
//           nameElement.innerHTML,
//           imageElement.getAttribute("src"),
//           `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
//         );

//           const isUniqueParticipant = !participantsArray.some(
//             (existingParticipant) =>
//               existingParticipant.name === participantData.name &&
//               existingParticipant.image === participantData.image
//           );

//           if (isUniqueParticipant) {
//             participantsArray.push(participantData);
//             const dataToSendInProgress = {
//               conferenceId: conferenceId,
//               conferenceStartTime: conferenceStartTime,
//               conferenceDate: conferenceDate,
//               status: "In progres",
//               participants: participantsArray,
//               conferenceEndTime: conferenceEndTime,
//               callDuration: callDuration,
//             };
//             chrome.runtime.sendMessage(dataToSendInProgress);
//           }
//           else{
//             const now = new Date();
//             participantData.timeJoing = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
//           }
//         }
//       });
//     }, 1000);
//     setInterval(() => {
//       const participantLeaveElement = document.querySelector(".VfPpkd-gIZMF");

//       if (
//         participantLeaveElement &&
//         window.getComputedStyle(participantLeaveElement).display !== "none"
//       ) {
//         const exitElementText =
//           participantLeaveElement.textContent.toLowerCase();

//         participantsArray.forEach((element) => {
//           const elementName = element.name.toLowerCase();

//           const words = exitElementText.split(" ");
//           const firstWords = words
//             .slice(0, elementName.split(" ").length)
//             .join(" ");

//           if (firstWords === elementName) {
//             const now = new Date();
//             const leaveTime =  `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//             element.timeInConference += calculateDuration(element.timeJoing, leaveTime);
//           }
//         });
//       }
//     }, 1000);
//   }
// }

// function calculateDuration(startTime, endTime) {
//   const start = new Date(`2000/01/01 ${startTime}`);
//   const end = new Date(`2000/01/01 ${endTime}`);
//   const duration = new Date(end - start);

//   const hours = duration.getUTCHours();
//   const minutes = duration.getUTCMinutes();
//   const seconds = duration.getUTCSeconds();

//   return `${hours}:${minutes}:${seconds}`;
// }

// let conferenceId = null;
// let conferenceStartTime = null;
// let conferenceEndTime = null;
// let conferenceDate = null;
// let callDuration = null;
// let participantsArray = [];
// let eventListenerAdded = false;

// class ParticipantData {
//   constructor(name, image, timeJoing) {
//     this.name = name;
//     this.image = image;
//     this.timeJoing = timeJoing;
//     this.timeInConference=null;
//   }
// }

// if (window.location.href.includes("meet.google.com")) {

//   conferenceId = window.location.pathname.split("/").pop();
//   const localStorageKey = `conferenceStarted_${conferenceId}`;

//   if (window.location.href.includes(conferenceId)) {

//     if (!localStorage.getItem(localStorageKey)) {
//       const now = new Date();
//       conferenceStartTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       const day = now.getDate().toString().padStart(2, "0");
//       const month = (now.getMonth() + 1).toString().padStart(2, "0");
//       const year = now.getFullYear();
//       conferenceDate = `${day}.${month}.${year}`;

//       const dataToSendStart = {
//         conferenceId: conferenceId,
//         conferenceStartTime: conferenceStartTime,
//         conferenceDate: conferenceDate,
//         status: "start",
//       };

//       chrome.runtime.sendMessage(dataToSendStart);

//       localStorage.setItem(localStorageKey, true);
//     }

//     const checkEndCallButton = setInterval(() => {
//       const endCallButton = document.querySelector(
//         'button[data-tooltip-id="tt-c34"]'
//       );
//       if (endCallButton && !eventListenerAdded) {
//         clearInterval(checkEndCallButton);
//         const handleClick = function () {

//           const now = new Date();
//       conferenceEndTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//       callDuration = calculateDuration(conferenceStartTime, conferenceEndTime);

//           participantsArray.forEach((element)=>{
//             if(element.timeInConference == null){
//               element.timeInConference = calculateDuration(element.timeJoing, conferenceEndTime);
//             }
//             else{
//               element.timeInConference = addDurations(element.timeInConference, conferenceEndTime);
//             }
//           })

//           const dataToSendEnd = {
//             conferenceId: conferenceId,
//             conferenceStartTime: conferenceStartTime,
//             conferenceDate: conferenceDate,
//             status: "end",
//             participants: participantsArray,
//             conferenceEndTime: conferenceEndTime,
//             callDuration: callDuration,
//           };
//           chrome.runtime.sendMessage(dataToSendEnd);
//           eventListenerAdded = true;
//         };

//         endCallButton.addEventListener("click", handleClick);
//       }
//     }, 1000);

//     setInterval(() => {
//       const participants = document.querySelectorAll(".dkjMxf");

//       participants.forEach((participant, index) => {
//         const nameElement = participant.querySelector(".dwSJ2e");
//         const imageElement = participant.querySelector(
//           'img[jscontroller="PcYCFc"]'
//         );

//         if (nameElement && imageElement) {
//          const now = new Date();
//         const participantData = new ParticipantData(
//           nameElement.innerHTML,
//           imageElement.getAttribute("src"),
//           `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
//         );

//           const isUniqueParticipant = !participantsArray.some(
//             (existingParticipant) =>
//               existingParticipant.name === participantData.name &&
//               existingParticipant.image === participantData.image
//           );

//           if (isUniqueParticipant) {
//             participantsArray.push(participantData);
//             const dataToSendInProgress = {
//               conferenceId: conferenceId,
//               conferenceStartTime: conferenceStartTime,
//               conferenceDate: conferenceDate,
//               status: "In progres",
//               participants: participantsArray,
//               conferenceEndTime: conferenceEndTime,
//               callDuration: callDuration,
//             };
//             chrome.runtime.sendMessage(dataToSendInProgress);
//           }
//           else{
//             const now = new Date();
//             participantData.timeJoing = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
//           }
//         }
//       });
//     }, 1000);
//     setInterval(() => {
//       const participantLeaveElement = document.querySelector(".VfPpkd-gIZMF");

//       if (
//         participantLeaveElement &&
//         window.getComputedStyle(participantLeaveElement).display !== "none"
//       ) {
//         const exitElementText =
//           participantLeaveElement.textContent.toLowerCase();

//         participantsArray.forEach((element) => {
//           const elementName = element.name.toLowerCase();

//           const words = exitElementText.split(" ");
//           const firstWords = words
//             .slice(0, elementName.split(" ").length)
//             .join(" ");

//           if (firstWords === elementName) {
//             const now = new Date();
//             const leaveTime =  `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//            // element.timeInConference += calculateDuration(element.timeJoing, leaveTime);
//           if(element.timeInConference != null){
//             element.timeInConference = addDurations(element.timeInConference, leaveTime);
//           }
//           else{
//             element.timeInConference += calculateDuration(element.timeJoing, leaveTime);
//           }
//           }
//         });
//       }
//     }, 1000);
//   }
// }

// function calculateDuration(startTime, endTime) {
//   const start = new Date(`2000/01/01 ${startTime}`);
//   const end = new Date(`2000/01/01 ${endTime}`);
//   const duration = new Date(end - start);

//   const hours = duration.getUTCHours();
//   const minutes = duration.getUTCMinutes();
//   const seconds = duration.getUTCSeconds();

//   return `${hours}:${minutes}:${seconds}`;
// }

// function addDurations(duration1, duration2) {
//   const [hours1, minutes1, seconds1] = duration1.split(":").map(Number);
//   const [hours2, minutes2, seconds2] = duration2.split(":").map(Number);

//   let totalSeconds = seconds1 + seconds2;
//   let totalMinutes = minutes1 + minutes2;
//   let totalHours = hours1 + hours2;

//   if (totalSeconds >= 60) {
//     totalSeconds %= 60;
//     totalMinutes += Math.floor(totalSeconds / 60);
//   }

//   if (totalMinutes >= 60) {
//     totalMinutes %= 60;
//     totalHours += Math.floor(totalMinutes / 60);
//   }

//   return `${totalHours.toString().padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}:${totalSeconds.toString().padStart(2, "0")}`;
// }




//REWRITE LOGIC WORKS
// let conferenceId = null;
// let conferenceStartTime = null;
// let conferenceEndTime = null;
// let conferenceDate = null;
// let callDuration = null;
// let participantsArray = [];
// let eventListenerAdded = false;

// class ParticipantData {
//   constructor(name, image, timeJoing) {
//     this.name = name;
//     this.image = image;
//     this.timeJoing = timeJoing;
//     this.timeInConference = null;
//   }
// }

// function sendData(status) {
//   const dataToSend = {
//     conferenceId: conferenceId,
//     conferenceStartTime: conferenceStartTime,
//     conferenceDate: conferenceDate,
//     status: status,
//     participants: participantsArray,
//     conferenceEndTime: conferenceEndTime,
//     callDuration: callDuration,
//   };

//   chrome.runtime.sendMessage(dataToSend);
// }

// function getStartedConferenceData() {
//   const now = new Date();
//   conferenceStartTime = `${now.getHours().toString().padStart(2, "0")}:${now
//     .getMinutes()
//     .toString()
//     .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//   const day = now.getDate().toString().padStart(2, "0");
//   const month = (now.getMonth() + 1).toString().padStart(2, "0");
//   const year = now.getFullYear();
//   conferenceDate = `${day}.${month}.${year}`;

//   sendData("start");
// }

// const endConferenceButtonClick = function () {
//   const now = new Date();
//   conferenceEndTime = `${now.getHours().toString().padStart(2, "0")}:${now
//     .getMinutes()
//     .toString()
//     .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
//   callDuration = calculateDuration(conferenceStartTime, conferenceEndTime);

//   participantsArray.forEach((element) => {
//     if (element.timeInConference == null) {
//       element.timeInConference = calculateDuration(
//         element.timeJoing,
//         conferenceEndTime
//       );
//     } else {
//       element.timeInConference = addDurations(
//         element.timeInConference,
//         conferenceEndTime
//       );
//     }
//   });

//   sendData("end");
//   eventListenerAdded = true;
// };

// function addPartisipant(name, image, timeJoing) {
//   const participantData = new ParticipantData(name, image, timeJoing);
//   participantsArray.push(participantData);
//   sendData("in progress");
// }

// if (window.location.href.includes("meet.google.com")) {
//   conferenceId = window.location.pathname.split("/").pop();
//   const localStorageKey = `conferenceStarted_${conferenceId}`;

//   if (window.location.href.includes(conferenceId)) {
//     if (!localStorage.getItem(localStorageKey)) {
//       getStartedConferenceData();
//       localStorage.setItem(localStorageKey, true);
//     }

//     const checkHost = setInterval(() => {
//       const hostName = document.querySelector(".dwSJ2e");
//       const hostImage = document.querySelector('img[jscontroller="PcYCFc"]');

//       if (hostName && hostImage) {
//         addPartisipant(
//           hostName.innerHTML,
//           hostImage.getAttribute("src"),
//           conferenceStartTime
//         );
//         clearInterval(checkHost);
//       }
//     }, 1000);

//     setInterval(() => {
//       const userEddingMessage = document.querySelector('[jsname="Ota2jd"]');
//       if (userEddingMessage != null) {
//         console.log("USer adding");
//         const newUserNameElement = document.querySelector(".md2Vmc");
//         const newUserImageElement = document.querySelector(
//           'img[jsname="YLEF4c"]'
//         );

//         const newUserNameElementText = newUserNameElement.innerHTML;
//         let wordsWithCapitalLetters = [];

//         let words = newUserNameElementText.split(" ");

//         for (let i = 0; i < words.length; i++) {
//           let word = words[i];
//           if (/^\p{Lu}/u.test(word)) {
//             wordsWithCapitalLetters.push(word);
//           }
//         }

//         const newUserName = wordsWithCapitalLetters.join(" ");
//         const newUserImage = newUserImageElement.getAttribute("src");

//         if (newUserName && newUserImage) {
//           const isUniqueParticipant = !participantsArray.some(
//             (existingParticipant) =>
//               existingParticipant.name === newUserName &&
//               existingParticipant.image === newUserImage
//           );

//           if (isUniqueParticipant) {
//             const now = new Date();
//             const timeJoing = `${now
//               .getHours()
//               .toString()
//               .padStart(2, "0")}:${now
//               .getMinutes()
//               .toString()
//               .padStart(2, "0")}:${now
//               .getSeconds()
//               .toString()
//               .padStart(2, "0")}`;
//               addPartisipant(newUserName, newUserImage, timeJoing);
//           }
//         }
//       }
//     }, 1000);

//     const checkEndCallButton = setInterval(() => {
//       const endCallButton = document.querySelector(
//         'button[data-tooltip-id="tt-c34"]'
//       );
//       if (endCallButton && !eventListenerAdded) {
//         clearInterval(checkEndCallButton);
//         endCallButton.addEventListener("click", endConferenceButtonClick);
//       }
//     }, 1000);
//   }
// }

// function calculateDuration(startTime, endTime) {
//   const start = new Date(`2000/01/01 ${startTime}`);
//   const end = new Date(`2000/01/01 ${endTime}`);
//   const duration = new Date(end - start);

//   const hours = duration.getUTCHours();
//   const minutes = duration.getUTCMinutes();
//   const seconds = duration.getUTCSeconds();

//   return `${hours}:${minutes}:${seconds}`;
// }

let conferenceId = null;
let conferenceStartTime = null;
let conferenceEndTime = null;
let conferenceDate = null;
let callDuration = null;
let participantsArray = [];
let eventListenerAdded = false;

class ParticipantData {
  constructor(name, image, timeJoining, timeInConference) {
    this.name = name;
    this.image = image;
    this.timeJoining = timeJoining;
    this.timeInConference = timeInConference;
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
    if (element.timeInConference == null) {
      element.timeInConference = calculateDuration(
        element.timeJoing,
        conferenceEndTime
      );
    } else {
      const newTimeInConference = calculateDuration(element.timeJoining, conferenceEndTime);
      element.timeInConference = addDurations(
        element.timeInConference,
        newTimeInConference
      );
    }
  });

  sendData("end");
  eventListenerAdded = true;
};

function addPartisipant(name, image, timeJoing) {
  const participantData = new ParticipantData(name, image, timeJoing);
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

    const checkParticipantLeaving = setInterval(() => {
      const participantLeaveElement = document.querySelector(".VfPpkd-gIZMF");
    
      if (participantLeaveElement && window.getComputedStyle(participantLeaveElement).display !== "none") {
        const exitElementText = participantLeaveElement.textContent.toLowerCase();
    
        participantsArray.forEach((element) => {
          if (exitElementText.includes("has left the meeting") || exitElementText.includes("залишає зустріч")) {
            const now = new Date();
            const newTimeInConference = calculateDuration(element.timeJoining, now);
            if(element.timeInConference == null){
              element.timeInConference = newTimeInConference;
            }
            else{
              element.timeInConference = addDurations(element.timeInConference, newTimeInConference);
            }
            // console.log(participantsArray[index]);
          }
        });
      }
    }, 1000)

    const checkParticipantAdding = setInterval(() => {
      const userEddingMessage = document.querySelector('[jsname="Ota2jd"]');
      
      if (userEddingMessage != null) {
          const newUserNameElement = document.querySelector(".md2Vmc");
          
          if (newUserNameElement) {
              const newUserImageElement = document.querySelector('img[jsname="YLEF4c"]');
              
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
              const newUserImage = newUserImageElement ? newUserImageElement.getAttribute("src") : null;
              
              if (newUserName && newUserImage) {
                  const isUniqueParticipant = !participantsArray.some(
                      (existingParticipant) =>
                      existingParticipant.name === newUserName &&
                      existingParticipant.image === newUserImage
                  );
                  
                  if (isUniqueParticipant) {
                      const now = new Date();
                      addPartisipant(newUserName, newUserImage, now);
                  }
                  else{
                    participantsArray.forEach((element) => {
                      if(element.name == newUserName && element.image == newUserImage){
                        const now = new Date();
                        element.timeJoining=now;
                      }
                    })
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
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}

function addDurations(existingDuration, newTime) {
  let duration = Math.abs(existingDuration + newTime);
  const hours = Math.floor(duration / 3600000);
  duration -= hours * 3600000;
  const minutes = Math.floor(duration / 60000);
  duration -= minutes * 60000;
  const seconds = Math.floor(duration / 1000);
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
}
// background.js


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    console.log("Received conference ID:", message.conferenceId);
    console.log("Conference date", message.conferenceDate);
    console.log("Conference start time: ", message.conferenceStartTime);
    console.log("Conference end time: ", message.conferenceEndTime);
    console.log("Status: ", message.status);
    console.log("Duration: ", message.callDuration);
    console.log("Participants: ", message.participants)

    console.log("____________________________");
});

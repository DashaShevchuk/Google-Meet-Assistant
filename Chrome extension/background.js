// background.js
    
var storedConferenceData;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Received conference ID:", message.conferenceId);
    console.log("Conference date", message.conferenceDate);
    console.log("Conference start time: ", message.conferenceStartTime);
    console.log("Conference end time: ", message.conferenceEndTime);
    console.log("Status: ", message.status);
    console.log("Duration: ", message.callDuration);
    console.log("Participants: ", message.participants);

    // Отримання поточних збережених даних
    chrome.storage.local.get({ 'conferenceData': [] }, function (result) {
        storedConferenceData = result.conferenceData || [];
        if (!Array.isArray(storedConferenceData)) {
            storedConferenceData = [];
        }

        var existingConferenceIndex = storedConferenceData.findIndex(function (data) {
            return data.conferenceId === message.conferenceId;
        });

        if (existingConferenceIndex === -1) {
            storedConferenceData.push({
                conferenceId: message.conferenceId,
                conferenceDate: message.conferenceDate,
                conferenceStartTime: message.conferenceStartTime,
                conferenceEndTime: message.conferenceEndTime,
                status: message.status,
                callDuration: message.callDuration,
                participants: message.participants
            });
        } else {
            storedConferenceData[existingConferenceIndex] = {
                conferenceId: message.conferenceId,
                conferenceDate: message.conferenceDate,
                conferenceStartTime: message.conferenceStartTime,
                conferenceEndTime: message.conferenceEndTime,
                status: message.status,
                callDuration: message.callDuration,
                participants: message.participants
            };
        }

        chrome.storage.local.set({ 'conferenceData': storedConferenceData }, function () {
            console.log('Conference data saved.');
        });

        console.log("____________________________");
    });
});


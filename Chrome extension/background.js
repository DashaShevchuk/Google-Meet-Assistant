var storedConferenceData;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  chrome.storage.local.get({ conferenceData: [] }, function (result) {
    storedConferenceData = result.conferenceData || [];
    if (!Array.isArray(storedConferenceData)) {
      storedConferenceData = [];
    }

    if (message.action === "addConference") {
      addConference(message.newConference);
    }

    if (message.action === "updateParticipants") {
      updateParticipants(message.conferenceId, message.participants);
    }

    if (message.action === "endConference") {
      endConference(message.endedConference);
    }

    if (message.action === "deleteConference") {
      deleteConference(message.conferenceIdToDelete);
    }

    if(message.action === "markThosePresent"){
      markThosePresent(message.conferenceParticipants);
    }
  });
});

function addConference(conference) {
  var existingConferenceIndex = storedConferenceData.findIndex(function (data) {
    return data.conferenceId === conference.conferenceId;
  });

  if (existingConferenceIndex === -1) {
    storedConferenceData.unshift({
      conferenceId: conference.conferenceId,
      conferenceDate: conference.conferenceDate,
      conferenceStartTime: conference.conferenceStartTime,
      conferenceEndTime: conference.conferenceEndTime,
      status: conference.status,
      callDuration: conference.callDuration,
      participants: conference.participants,
    });
  }

  chrome.storage.local.set({ conferenceData: storedConferenceData });
}

function updateParticipants(conferenceId, participants) {
  chrome.storage.local.get("latestConferenceId", function (result) {
    var latestConferenceId = result.latestConferenceId;

    if (conferenceId !== latestConferenceId) {
      var conferenceIdToUpdate = storedConferenceData.findIndex(function (
        data
      ) {
        return data.conferenceId === conferenceId;
      });
      storedConferenceData[conferenceIdToUpdate].participants = [];
      participants.forEach((element) => {
        storedConferenceData[conferenceIdToUpdate].participants.push(element);
      });

      storedConferenceData[conferenceIdToUpdate].status = "in progress";
      chrome.storage.local.set({ conferenceData: storedConferenceData });
    }
  });
}

function endConference(conference) {
  chrome.storage.local.get("latestConferenceId", function (result) {
    var latestConferenceId = result.latestConferenceId;

    if (conference.conferenceId !== latestConferenceId) {
      var endedConferenceIndex = storedConferenceData.findIndex(function (
        data
      ) {
        return data.conferenceId === conference.conferenceId;
      });

      if (storedConferenceData[endedConferenceIndex]) {
        storedConferenceData[endedConferenceIndex].status = conference.status;
        storedConferenceData[endedConferenceIndex].conferenceEndTime =
          conference.conferenceEndTime;
        storedConferenceData[endedConferenceIndex].callDuration =
          conference.callDuration;
        storedConferenceData[endedConferenceIndex].participants = [];
        conference.participants.forEach((element) => {
          storedConferenceData[endedConferenceIndex].participants.push(element);
        });
        chrome.storage.local.set({ conferenceData: storedConferenceData });
      }
    }
  });
}

function deleteConference(conferenceId) {
  var conferenceIndexToDelete = storedConferenceData.findIndex(function (data) {
    return data.conferenceId === conferenceId;
  });

  if (conferenceIndexToDelete !== -1) {
    storedConferenceData.splice(conferenceIndexToDelete, 1);
    chrome.storage.local.set({ conferenceData: storedConferenceData });
  }
}


function markThosePresent(conferenceParticipantsArr) {
  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; i++) {
      // Check if the tab's URL matches the local file path
      if (tabs[i].url && tabs[i].url.startsWith("file:///C:/Users/user/Desktop/marks")) {
        chrome.tabs.sendMessage(tabs[i].id, {
          action: "markPresent",
          conferenceParticipants: conferenceParticipantsArr
        });
      }
    }
  });
}
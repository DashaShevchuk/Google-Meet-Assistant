// background.js


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    console.log("Text:", message.text);
    console.log("Received conference ID:", message.conferenceId);
    console.log("Conference date", message.conferenceDate);
    console.log("Conference start time: ", message.conferenceStartTime);
    console.log("Conference end time: ", message.conferenceEndTime);
    console.log("Status: ", message.status);
    console.log("Duration: ", message.callDuration);
    console.log("Participants: ", message.participants)
    
    // // Check if participants is an array before iterating
    // if (Array.isArray(message.participants)) {
    //     // Log each participant
    //     console.log("Participants:");
    //     message.participants.forEach((participant, index) => {
    //         console.log(`Participant ${index + 1}:`);
    //         console.log("  Name:", participant.name);
    //         console.log("  Image:", participant.image);
    //     });
    // } else {
    //     console.log("Participants data is not an array or is undefined.");
    // }

    console.log("____________________________");
});

var conferenceParticipants = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "markPresent") {
   
    const loadParticipantsPromise = new Promise((resolve, reject) => {
      message.conferenceParticipants.forEach((element) => {
        const participantName = element.name;
        conferenceParticipants.push(participantName);
      });
      resolve();
    });

    console.log(conferenceParticipants);
    loadParticipantsPromise.then(() => {
      const studentRows = document.querySelectorAll("tr");

      studentRows.forEach((row) => {
        const studentName = rearrangeName(
          row.querySelector(".trB").innerText.trim()
        );

        if (!conferenceParticipants.includes(studentName)) {
          const input = row.querySelector(".vrt.form-control");

          if (input) {
            input.value = "нб";
          }
        }
      });
    });
  }
});

function rearrangeName(name) {
  const words = name.split(" ");
  if (words.length > 1) {
    const firstWord = words.shift();
    words.push(firstWord);
    return words.join(" ");
  }
  return name;
}

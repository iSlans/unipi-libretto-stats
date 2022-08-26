document.body.onload = () => { setCheckbox(); calc(); };

const button = document.getElementById('calc_data');
button.onclick = calc;
// console.log(button);

async function calc() {
    const div = document.getElementById('custom_data');

    // Get current active tab
    let currentTab = chrome.tabs.query({ active: true, currentWindow: true });
    currentTab.then(tabs => {

        // console.log("Current Tab", tabs);
        let tab = tabs[0];
        chrome.tabs.sendMessage(
            tab.id,
            { type: "calculate" },
            (response) => {
                if (!response) return;
                console.log("Got response from content script: ", response);
                let { totCrediti, media, mediaPesata } = response;
                div.innerHTML =
                    `<p> Totale: ${totCrediti} crediti</p>
                     <p> Media: ${media}</p>
                     <p> Media Pesata: ${mediaPesata}</p>
                `;
            }
        );
    });

}

async function setCheckbox() {
    let currentTab = chrome.tabs.query({ active: true, currentWindow: true });
    currentTab.then(tabs => {
        // console.log("Current Tab", tabs);
        let tab = tabs[0];

        chrome.tabs.sendMessage(
            tab.id,
            { type: "setCheckbox" },
            (response) => {
                if (!response) return;
                console.log("Got response from content script: ", response);
            }
        );
    });
}


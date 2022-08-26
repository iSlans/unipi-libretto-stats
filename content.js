
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("Receveid request", request, sender);

    let response;

    switch (request.type) {
        case 'calculate':
            response = calculate(); break;
        case 'setCheckbox':
            response = setCheckbox(); break;
    }

    sendResponse(response)
    // console.log("returning promise to popup");
    // return Promise.resolve(tot);
});

function calculate() {
    let crediti = $('#tableLibretto tr.voto td:nth-child(3)').toArray().map(x => parseInt(x.innerText));
    let voti = $('#tableLibretto tr.voto td:nth-child(6)').toArray().map(x => x.innerText.includes('30L') ? 33 : parseInt(x.innerText));
    let votiInt = voti.filter(x => x);

    let totCrediti = crediti.reduce((sum, elem) => sum + elem, 0);
    let media = votiInt.reduce((sum, elem) => sum + elem, 0) / votiInt.length;
    media = media.toFixed(2);

    let subTot = 0;
    let subCrediti = 0;
    voti.forEach((voto, index) => {
        if (voto) {
            subTot += voto * crediti[index];
            subCrediti += crediti[index];
        }
    });

    let mediaPesata = subTot / subCrediti;
    mediaPesata = mediaPesata.toFixed(2);

    let custom = $('.custom-stats');
    if (custom.length < 1) {
        custom = $('<div></div>');
        custom.addClass('custom-stats');
        $('#tableLibretto').before(custom);

        custom.css({
            margin: '5px auto',
            width: 'fit-content',
            fontFamily: 'monospace',
            // float: 'right',
            border: '2px #f3a900 solid',
            padding: '15px 50px'
        });
    }

    custom.html(
        `<p> Totale: ${totCrediti} crediti</p>
         <p> Media: ${media}</p>
         <p> Media Pesata: ${mediaPesata}</p>
        `
    );

    return { totCrediti, media, mediaPesata };
}

function setCheckbox() {
    let first_td = $('#tableLibretto tr td:nth-child(1)');

    let checkbox = $('.extension_voto:checkbox');
    if (checkbox.length < 1) {
        checkbox = $('<input type="checkbox"></input>');

        checkbox.addClass('extension_voto');
        checkbox.css({
            float: 'right',
            margin: '6px',
            transform: 'scale(1.5)'
        });
        checkbox.on('change', handleCheck);

        first_td.append(checkbox);
        first_td.each((i) => { first_td[i].lastElementChild.click() });

        function handleCheck(e) {
            const box = e.target;
            const tr = box.parentNode.parentNode;
            tr.classList.toggle('voto', box.checked);
            // console.log('change', box.checked, tr);

            calculate();
        }
    }

    return 'checkbox added';
}
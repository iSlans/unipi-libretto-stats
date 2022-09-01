
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("Receveid request", request, sender);

    let response;

    switch (request.type) {
        case 'calculate':
            response = calculate(); break;
        case 'toggleData':
            response = toggle(); break;
        case 'setCheckbox':
            response = setCheckbox(); break;
    }

    sendResponse(response)
    // console.log("returning promise to popup");
    // return Promise.resolve(tot);
});

function calculate() {

    let tableClass, votoColumn, creditoColumn;
    if (window.location.href.search('libretto.unipi') >= 0) {
        tableClass = '.table.table-hover.table-striped';
        votoColumn = 'td:nth-child(3)';
        creditoColumn = 'td:nth-child(5)'
    } else {
        tableClass = '#tableLibretto';
        votoColumn = 'td:nth-child(6)';
        creditoColumn = 'td:nth-child(3)'
    }

    let crediti = $(`${tableClass} tr.voto ${creditoColumn}`).toArray().map(x => parseInt(x.innerText));
    let voti = $(`${tableClass} tr.voto ${votoColumn}`).toArray().map(x => x.innerText.match(/30L|30 L|lode/gi) ? 33 : parseInt(x.innerText));
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
        $(`${tableClass}`).before(custom);

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

function toggle() {
    let custom = $('.custom-stats');
    custom.toggle();
    return 'toggled'
}

function setCheckbox() {

    let tableClass, boxCol;
    if (window.location.href.search('libretto.unipi') >= 0) {
        tableClass = '.table.table-hover.table-striped';
        boxCol = 'td:nth-child(2)'
    } else {
        tableClass = '#tableLibretto';
        boxCol = 'td:nth-child(1)'
    }

    let first_td = $(`${tableClass} tr ${boxCol}`);

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
            if (tr.nodeName != 'TR') {
                console.info('error: could not find tr element');
            }
            tr.classList.toggle('voto', box.checked);
            // console.log('change', box.checked, tr);

            calculate();
        }
    }

    return 'checkbox added';
}
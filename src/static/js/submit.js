function submitNumber() {

    verifyItems();
}

function verifyItems() {

    var scamType = document.getElementById('scamTypeSelect').value;
    var number = document.getElementById('submitNumber').value;
    var comment = document.getElementById('submitComment').value;

    var yesRadio = document.getElementById('yesVerifiedNumber').checked;
    var choiceThing = document.getElementById('invalidChoiceMsg');

    if (!scamType) document.getElementById('invalidScamTypeMsg').setAttribute('style', 'display: block;');
    if (!number) {
        document.getElementById('submitNumber').setAttribute('class', 'input is-danger');
        document.getElementById('invalidNumberMsg').setAttribute('style', 'display: block;');
    }
    if (!comment) document.getElementById('submitComment').setAttribute('class', 'textarea is-danger');

    if (!yesRadio) {
        choiceThing.setAttribute('style', 'display: block');
    } else {
        choiceThing.setAttribute('style', 'display: none');
    }

    if (!(!scamType || !number || !comment || !yesRadio)) {

        if (!checkValidNumber()) {
            console.log(`Sorry that number appears to be invalid!`);
            document.getElementById('submitNumber').setAttribute('class', 'input is-danger');
            document.getElementById('invalidNumberMsg').setAttribute('style', 'display: block;');
            return;
        }

        var countryInfo = fetchCountryInfo();

        submit(scamType, number, countryInfo.prefix, countryInfo.name, comment);
    } else {
        console.log(`You need to fill in all the fields!`);
    }
}

function checkValidNumber() {
    return $("#submitNumber").intlTelInput("isValidNumber");
}

function submit(scamType, number, country, countryName, comment) {

    var submitXhr = new XMLHttpRequest();
    submitXhr.open('GET', `${hostUrl}${buildSubmitUrl(scamType, number, country, countryName, comment)}`);
    submitXhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            submitSuccessfull();
        } else {
            showSnackbar('You were unable to submit that number, maybe it was already submitted or it was a legit number?');
        }
    };
    submitXhr.send();
}

function buildSubmitUrl(scamType, number, country, countryName, comment) {
    let url = '/api/submit?';

    url += `type=${scamType}`;
    url += `&number=${number}`;
    url += `&countryCode=${country}`;
    url += `&countryName=${countryName}`;
    url += `&comment=${comment}`;

    return url;
}

function fetchCountryInfo() {
    var countryData = $("#submitNumber").intlTelInput("getSelectedCountryData");
    return {name: countryData.name, prefix: countryData.dialCode};
}

function submitSuccessfull() {
    console.log(`Successfully submit number!`);
    document.getElementById('successNotification').setAttribute('style', 'display: block;');

    resetFields();
}

function resetFields() {
    document.getElementById('submitNumber').value = '';
    document.getElementById('submitComment').value = '';
    document.getElementById('yesVerifiedNumber').checked = false;

    hideErrorNotifications();
}

function hideSuccessfullInfo() {
    document.getElementById('successNotification').setAttribute('style', 'display: none;');
}

function hideErrorNotifications() {
    document.getElementById('invalidScamTypeMsg').setAttribute('style', 'display: none;');
    document.getElementById('submitNumber').setAttribute('class', 'input');
    document.getElementById('invalidNumberMsg').setAttribute('style', 'display: none;');
    document.getElementById('submitComment').setAttribute('class', 'textarea');
    document.getElementById('invalidChoiceMsg').setAttribute('style', 'display: none;');
}

function showSnackbar(text) {
    var bar = document.getElementById("snackbar");
    bar.innerHTML = text;
    bar.className = "show";

    setTimeout(function () {
        bar.className = bar.className.replace("show", "");
    }, 3000);
}


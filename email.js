console.log('Hi! You are in email.js');

var checkedWords = [];

function checkGmail() {
    var elements = document.querySelectorAll('div.editable[aria-label="Message Body"]'); // In case user opens multiple compose tabs
    if (elements.length > 0) {
        elements.forEach(function (element, elementIndex) {
            console.log('Found element');
            console.log(element.innerText);
            console.log(checkedWords);
            var words = element.innerText.split(' ');
            words.forEach(function (item, index) {
                var word = item.trim();
                if (word.length > 0 && checkedWords.indexOf(word) == -1) {
                    sendPostWord(word);
                    checkedWords.push(word);
                }
            });
        });
    } else {
        console.log('No element found');
    }
}

function sendPostWord(word) {
    $.ajax({
        type: 'POST',
        url: 'https://mh2022.muchskeptical.net/api/check_words',
        data: JSON.stringify({'words': word}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            if (!data.safe) {
                iziToast.warning({
                    title: 'Hello Friend!',
                    color: 'blue',
                    maxWidth: 500,
                    position: 'topRight',
                    message: 'I noticed that you typed the word: ' + word + '. This could potentially be sensitive information that might not be safe to share over email!',
                    iconUrl: 'https://cdn.muchskeptical.net/mh2022/icon.png',
                    timeout: 10000,
                    buttons: [
                        ['<button class = "button-learn">Learn More</button>', function (instance, toast) {
                             iziToast.info({
                                 title: 'Stuff about digital security and why they should care',
                                 color: 'blue',
                                 message: 'internet = bad',
                                 position: 'topRight',
                                 timeout: 10000,
                                 maxWidth: 500,
                                 iconUrl: 'https://cdn.muchskeptical.net/mh2022/icon.png',
                             })             
                        }],
                    ]
                });
            }
        },
        error: function(e) {
            console.log(e);
        }
    });
}

if (window.location.hostname == 'mail.google.com') {
    setInterval(checkGmail, 10000);
}
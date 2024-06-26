
let cardData = [
    {
        site: 'STRIPE TRIAL',
        country: 'US',
        bin: '515462002018xxxx|09|2027|xxx',
        link: null
    },
    {
        site: 'YOUTUBE',
        country: 'ALGERIA',
        bin: '546775977863xxxx|02|2029|xxx',
        link: null
    },
    {
        site: 'MS 365 | COPILOT',
        country: 'US',
        bin: '515462003923|09|2027|xxx'
    },
    {
        site: 'TIDAL',
        country: 'US',
        bin: '4815830040|03|2029|xxx',
        link: null
    },
    {
        site: 'APPLE TV | APPLE MUSIC',
        country: 'MEXICO',
        bin: '413098170337xxxx|06|2026|xxx',
        link: 'https://redeem.services.apple/roktappletv-mx'
    },
      {
        site: 'CHESS.COM',
        country: 'US / OWN',
        bin: '555270011808|07|2027|xxx',
        link: null
    },
    {
        site: 'PEACOCK',
        country: 'US',
        bin: '443547050x4xxxxx|xx|xx|xxx',
        link: null
    },
    {
        site: 'CANVA',
        country: 'BHUTAN / THIMPU',
        bin: '546775560834xxxx|03|32|xxx',
        link: null
    },
    {
        site: 'CRUNCHYROLL',
        country: 'INDO ZIP 00000',
        bin: '55769200551xxxxx|07|27|xxx',
        link: null
    },
     {
        site: 'PRIME VIDEO (CANADA)',
        country: 'CANADA',
        bin: '454033189113xxxx|01|27|xxx',
        link: null
    },
     {
        site: 'YOUTUBE PH',
        country: 'OWN',
        bin: '546775820853xxxx|06|27|xxx',
        link: null
    },
     {
        site: 'TIDAL / PLEX / STAN.AU',
        country: 'US',
        bin: '53635000072xxxxx|12|30|xxx',
        link: null
    },
     {
        site: '2D SITE (BUG BIN) (MC)',
        country: 'RANDOM',
        bin: '5425504502xxxxxx|xx|xx|xxx',
        link: null
    },
     {
        site: 'YOUTUBE US',
        country: 'US',
        bin: '49987100012xxxxx|xx|xx|xxx',
        link: null
    },

];
document.addEventListener('DOMContentLoaded', function () {
    var monthDropdown = document.getElementById('monthDropdown');
    var yearDropdown = document.getElementById('yearDropdown');

    var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    if (monthDropdown && yearDropdown) {
        // For Month Dropdown
        var defaultMonth = document.createElement('option');
        defaultMonth.textContent = "Select a Month";
        defaultMonth.value = "";
        monthDropdown.appendChild(defaultMonth);

        for (var i = 0; i < months.length; i++) {
            var option = document.createElement('option');
            option.value = i + 1;
            option.textContent = (i + 1) + ' - ' + months[i];
            monthDropdown.appendChild(option);
        }

        // For Year Dropdown
        var defaultYear = document.createElement('option');
        defaultYear.textContent = "Select a Year";
        defaultYear.value = "";
        yearDropdown.appendChild(defaultYear);

        var currentYear = new Date().getFullYear();
        for (var year = currentYear; year <= currentYear + 10; year++) {
            var option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        }

    } else {
        console.error("Dropdown elements not found");
    }

    // button
    var generateBtn = document.getElementById("generateBtn");
    generateBtn.addEventListener('click', function () {
        let prefixBin = document.getElementById('prefixBin').value;
        let month = document.getElementById('monthDropdown').value;
        let year = document.getElementById('yearDropdown').value;
        const cardQuantity = 10;
        const cardsOutput = document.getElementById('cardsOutput');
        const errorElement = document.getElementById('error');

        errorElement.textContent = '';
        cardsOutput.innerHTML = '';

        prefixBin = prefixBin.replace(/[^0-9]/g, '');

        if (!prefixBin || prefixBin.length < 6) {
            errorElement.textContent = 'Invalid BIN.';
            return;
        }


        const randomDigitsCount = 15 - prefixBin.length;

        for (let i = 0; i < cardQuantity; i++) {


            let number = prefixBin + Array(randomDigitsCount).fill(0).map(randomNumber).join('');
            let years = year ? year.toString().slice(-2) : randomYear();
            let months = month ? month.toString().slice(-2).padStart(2, '0') : randomMonth();

            number += generateCheckDigit(number) + '|' + months + '|' + years + '|' + Math.floor(100 + Math.random() * 900);
            let checkDigit = number.split('|')[0];
            const newP = document.createElement("p");
            newP.textContent = number;
            newP.className = 'generated-number';

            const copyIcon = document.createElement("i");
            copyIcon.className = "fas fa-copy copy-icon";
            copyIcon.style.cursor = 'pointer';

            newP.appendChild(copyIcon);

            copyIcon.addEventListener('click', function () {
                navigator.clipboard.writeText(checkDigit).then(() => showToast(checkDigit))
            });

            cardsOutput.appendChild(newP);
        }
    });

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInit();
    }
});
function searchInit() {
    document.getElementById('searchInput').addEventListener('keyup', function () {
        filterCards();
    });
}

function filterCards() {
    var input, filter, filteredData;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();

    filteredData = cardData.filter(card =>
        card.site.toUpperCase().includes(filter) ||
        card.country.toUpperCase().includes(filter) ||
        card.bin.toUpperCase().includes(filter)
    );

    displayCards(filteredData);
}

function displayCards(cards) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';  // Clear the container

    cards.forEach(card => {
        cardsContainer.innerHTML += `
        <div class="card mx-auto">
            <div class="card-header text-center">
                ${card.site} - ${card.country} ${card.link ? `-> <a style="text-decoration:none" href="${card.link}">USEFUL LINK</a>` : ''
            }
            </div>
            <div class="card-body text-center">
                ${card.bin}
                <button onclick="copyToClipboard('${card.bin}')" class="btn" aria-label="Copy BIN">
                    <i class="fas fa-copy copy-icon"></i>
                </button>
            </div>
        </div>
    `;
    });
}
function randomNumber() {
    return Math.floor(Math.random() * 10).toString();
}

function generateCheckDigit(number) {
    let sum = 0, alt = true, digits = number.length;
    for (let i = digits - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        if (alt) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        alt = !alt;
    }
    return (10 - (sum % 10)) % 10;
}

function randomMonth() {
    const randomNumber = Math.floor(Math.random() * 12) + 1;
    return randomNumber <= 9 ? '0' + randomNumber : randomNumber.toString();
}
function randomYear() {
    const year = new Date().getFullYear() + Math.floor(Math.random() * 6);
    return year.toString().substr(2, 2);
}

function showToast(checkDigit) {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    toast.style.opacity = 1;
    toast.style.bottom = '40px';
    toast.style.zIndex = 9999;
    toast.textContent = "Copied to clipboard! " + checkDigit;

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.bottom = '20px';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 2000);
}


$(document).ready(function () {

    $('#binListModal').on('show.bs.modal', function (event) {
        displayCards(cardData);
    });



    /* ---------------------------- populate binlist ---------------------------- */



});

function copyToClipboard(bin) {
    let copyBin = bin.split('|')[0];
    navigator.clipboard.writeText(copyBin).then(() => {
        showToast(copyBin);
    }).catch(err => {
        console.error('Error in copying text: ', err);
    });
}

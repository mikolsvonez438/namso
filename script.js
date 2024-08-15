
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
    generateBtn.addEventListener('click', async function () {
        let prefixBin = document.getElementById('prefixBin').value;
        let checkLive = document.getElementById('checkLive');
        let stat = undefined
        let statBankName = undefined
        // console.log('checkLive', checkLive.checked)
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
            if (checkLive.checked) {
                stat = await isLive(number);
                statBankName = stat.bankNAme;
            }

            let checkDigit = number.split('|')[0];
            const newP = document.createElement("p");
            newP.textContent = number;
            newP.className = 'generated-number';

            const copyIcon = document.createElement("i");
            copyIcon.className = "fas fa-copy copy-icon";
            copyIcon.style.cursor = 'pointer';
            newP.appendChild(copyIcon);
            if (checkLive.checked) {
                const statusIcon = document.createElement("span");
                statusIcon.className = "status-icon";
                statusIcon.style.paddingLeft = '5px';
                statusIcon.textContent = stat.status == "Dead" || stat.status == "Unknown" ? '❌' : '✔️';
                newP.appendChild(statusIcon);
            }



            copyIcon.addEventListener('click', function () {
                navigator.clipboard.writeText(checkDigit).then(() => showToast(checkDigit))
            });
            if (checkLive.checked) {
                var bankNameInput = document.getElementById('bankName');

                if (!bankNameInput.textContent || bankNameInput.textContent == 'Unknown' || bankNameInput.textContent != statBankName) {
                    bankNameInput.textContent = statBankName;
                }
            }

            cardsOutput.appendChild(newP);
        }
    });

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInit();
    }
});

function isLive(kardo) {
    return axios.get(`https://cc-fordward.onrender.com/check?cc=${kardo}`).then((res) => {
        return { bankNAme: res.data.bankName, status: res.data.status };
    })
}
function checkBinList(Binii) {
    return axios.get(`https://cc-fordward.onrender.com/checkcc?binValue=${Binii}`).then((res) => {
        return {
            bankName: res.data.bank.name,
            type: res.data.type,
            country: res.data.country.name,
            scheme: res.data.scheme,
            category: res.data.category
        };
    });
}
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
    // axios.get(`https://randomuser.me/api/1.4/?nat=us`).then((res) => {
    //     console.log(res.data.results[0])
    // })
    $('#binListModal').on('show.bs.modal', function (event) {
        displayCards(cardData);
    });

    $('#modalPasswordGenerator').on('shown.bs.modal', function (event) {
        var passwordLengthInput = document.getElementById('passwordLength');
        var includeSpecialCharsCheckbox = document.getElementById('includeSpecialChars');
        var generatedPasswordInput = document.getElementById('generatedPassword');
        var passwordLengthValue = document.getElementById('passwordLengthValue');
        var generatePasswordBtn = document.getElementById('generatePasswordBtn');

        function generatePassword() {
            var passwordLength = passwordLengthInput.value;
            var includeSpecialChars = includeSpecialCharsCheckbox.checked;
            var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            if (includeSpecialChars) {
                charset += '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
            }
            var password = '';
            for (var i = 0; i < passwordLength; i++) {
                var randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            generatedPasswordInput.value = password;
        }

        generatePassword();

        passwordLengthInput.addEventListener('input', function () {
            passwordLengthValue.textContent = this.value;
            generatePassword();
        });

        generatePasswordBtn.addEventListener('click', function () {
            generatePassword();
        })
        includeSpecialCharsCheckbox.addEventListener('change', function () {
            generatePassword();
        });
    });



    /* ---------------------------- populate binlist ---------------------------- */


    /* ----------------------------------- BIN LOOK UP ----------------------------------- */
    $('#binLookUpModal').on('shown.bs.modal', function (event) {
        document.getElementById('Binni').addEventListener('input', function () {
            const resultElement = document.getElementById('result');
            if (this.value.length == 6) {
                checkBinList(this.value)
                    .then((res) => {
                        console.log('result', res);

                        resultElement.innerHTML = `
                        <p>Bank Name: ${res.bankName}</p>
                        <p>Type: ${res.type} | ${res.category} | ${res.scheme}</p>
                        <p>Country: ${res.country}</p>
                    `;
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                resultElement.innerHTML = '';
            }
        });
    });
});

function copyToClipboard(bin) {
    let copyBin = bin.split('|')[0];
    navigator.clipboard.writeText(copyBin).then(() => {
        showToast(copyBin);
    }).catch(err => {
        console.error('Error in copying text: ', err);
    });
}

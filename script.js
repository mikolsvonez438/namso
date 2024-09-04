
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


        const isAmex = prefixBin.startsWith('34') || prefixBin.startsWith('37');
        const cardLength = isAmex ? 15 : 16;
        const randomDigitsCount = cardLength - prefixBin.length - 1;
        for (let i = 0; i < cardQuantity; i++) {


            let number = prefixBin;

            if (isAmex) {
                number += Array(randomDigitsCount).fill(0).map(randomNumber).join('');
                number += generateCheckDigit(number);
            } else {
                number += Array(randomDigitsCount).fill(0).map(randomNumber).join('');
                number += generateCheckDigit(number);
            }

            let years = year ? year.toString().slice(-2) : randomYear();
            let months = month ? month.toString().slice(-2).padStart(2, '0') : randomMonth();

            number += '|' + months + '|' + years + '|' + (isAmex ? Math.floor(1000 + Math.random() * 9000) : Math.floor(100 + Math.random() * 900));
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
async function checkBinList(Binii) {
    let aray = [];
    await axios.get(`https://cc-fordward.onrender.com/checkccs`, {
        params: {
            bins: Binii
        }
    }).then((res) => {
        res.data.forEach((data) => {
            aray.push({
                bin: data.number.iin,
                bankName: data.bank.name,
                type: data.type,
                country: data.country.name,
                scheme: data.scheme,
                category: data.category
            })
        })
        // console.log('pak', pak)
        // return {
        //     bin: res.data.number.iin,
        //     bankName: res.data.bank.name,
        //     type: res.data.type,
        //     country: res.data.country.name,
        //     scheme: res.data.scheme,
        //     category: res.data.category
        // };
    });
    return aray;
}
function shortURL(url) {
    return axios.get(`https://cc-fordward.onrender.com/shortme?url=${url}`).then((res) => {
        return res.data.shortLink

    });
}

function searchInit() {
    document.getElementById('searchInput').addEventListener('keyup', function () {
        filterCards();
    });
}

async function shortMyURL(url) {
    let response = await shortURL(url);
    console.log('response', response)
    const urlContainer = document.getElementById('urlContainer');
    urlContainer.innerHTML = '';
    urlContainer.innerHTML += `
    <div class="card ">
            <div class="card-body text-center">
                ${response}
                <button onclick="copyToClipboard('${response}')" class="btn" aria-label="COPY URL">
                    <i class="fas fa-copy copy-icon"></i>
                </button>
            </div>
        </div>
    `;
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

    $('#shortModal').on('show.bs.modal', function (event) {
        document.getElementById('urlText').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                shortMyURL(document.getElementById('urlText').value);
            }
        });

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
        document.getElementById('Binni').addEventListener('input', async function (e) {
            const textarea = e.target;
            const lines = textarea.value.split('\n');

            const formattedLines = lines.map(line => {
                const digits = line.replace(/\D/g, '');
                return digits.slice(0, 6);
            });

            textarea.value = formattedLines.join('\n');

            let resultElement = document.getElementById('result');

            const bins = formattedLines.filter(bin => bin.length === 6);

            if (bins.length > 0) {
                resultElement.innerHTML = '';
                const checkBinListResult = await checkBinList(bins);
                console.log('checkBinListResult', checkBinListResult)
                checkBinListResult.forEach((bin) => {
                    const binColor = bin.country === "PHILIPPINES" ? "red" : "inherit";
                    resultElement.innerHTML += `<span style="color: ${binColor}">${bin.bin}</span> => ${bin.country} <br>`;
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

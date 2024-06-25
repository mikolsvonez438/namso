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

            const newP = document.createElement("p");
            newP.textContent = number;
            newP.className = 'generated-number';

            const copyIcon = document.createElement("i");
            copyIcon.className = "fas fa-copy copy-icon";
            copyIcon.style.cursor = 'pointer';

            newP.appendChild(copyIcon);

            copyIcon.addEventListener('click', function () {
                navigator.clipboard.writeText(newP.textContent).then(() => showToast())
                // alert("Copied: " + newP.textContent);
            });

            cardsOutput.appendChild(newP);
        }
    });
});

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

function showToast() {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    toast.style.opacity = 1;
    toast.style.bottom = '40px';

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.bottom = '20px';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 2000);
}

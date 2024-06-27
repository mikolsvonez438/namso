document.addEventListener("DOMContentLoaded", function () {
    const countryDropDown = document.getElementById('countryDropDown');
    let countryList = [
        { code: 'us', name: 'United States' },
        { code: 'au', name: 'Australia' },
        { code: 'br', name: 'Brazil' },
        { code: 'ca', name: 'Canada' },
        { code: 'ch', name: 'Switzerland' },
        { code: 'de', name: 'Germany' },
        { code: 'dk', name: 'Denmark' },
        { code: 'es', name: 'Spain' },
        { code: 'fi', name: 'Finland' },
        { code: 'fr', name: 'France' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'ie', name: 'Ireland' },
        { code: 'in', name: 'India' },
        { code: 'ir', name: 'Iran' },
        { code: 'mx', name: 'Mexico' },
        { code: 'nl', name: 'Netherlands' },
        { code: 'no', name: 'Norway' },
        { code: 'nz', name: 'New Zealand' },
        { code: 'rs', name: 'Serbia' },
        { code: 'tr', name: 'Turkey' },
        { code: 'ua', name: 'Ukraine' }
    ];

    if (countryDropDown) {
        countryList.forEach(country => {
            var option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countryDropDown.appendChild(option);
        });
    }

    countryDropDown.addEventListener('change', function () {
        const countryCode = this.value;
        if (countryCode) {
            axios.get(`https://randomuser.me/api/?nat=${countryCode}`)
                .then(response => {
                    if (response.data.results.length > 0) {
                        const user = response.data.results[0];
                        updateFormFields(user);
                    } else {
                        console.error('No results found');
                    }
                }).catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    });

    // Update form fields based on selected user data
    function updateFormFields(user) {
        const formFields = {
            name: `${user.name.first} ${user.name.last}`,
            street: `${user.location.street.name} ${user.location.street.number}`,
            city: `${user.location.city}`,
            state: `${user.location.state}`,
            postalCode: `${user.location.postcode}`,
            country: `${user.nat}`,
            phoneNumber: `${user.cell}`
        };

        Object.entries(formFields).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
            } else {
                console.error(`Element with ID "${key}" not found.`);
            }
        });
    }

    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInit();
    }
});

$(document).ready(function () {
    $('#binListModal').on('show.bs.modal', function (event) {
        displayCards(cardData);
    });
});

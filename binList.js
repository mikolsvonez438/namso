let cardData = [
    {
        site: 'STRIPE TRIAL',
        country: 'US',
        bin: '515462002018xxxx|09|2027|xxx',
        link: null
    },
      {
        site: 'Curiositystream ',
        country: 'US',
        bin: '515462004578|10|2026|xxx',
        link: null
    },
     {
        site: 'CANVA / TRY ON OTHER SITE',
        country: 'BHUTAN OR RND',
        bin: '41546444051xxxxx|xx|xxxx|xxx',
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
    {
        site: 'FUBO.TV',
        country: 'US',
        bin: '55750100000xxxxx|xx|xx|xxx',
        link: null
    },
 {
        site: 'MULTI FUNCTIONAL',
        country: 'US',
        bin: '55750100000xxxxx|xx|xxxx|xxx',
        link: null
    },
];


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

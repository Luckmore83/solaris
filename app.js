const planetarySymbols = { // I added planetary symbols to show next to the celestial body names.
    'solen': '☉',
    'merkurius': '☿',
    'venus': '♀',
    'jorden': '🜨',
    'mars': '♂',
    'jupiter': '♃',
    'saturnus': '♄',
    'uranus': '♅',
    'neptunus': '♆'
};
// Event listener for when the mouse enters a planet's element.
document.addEventListener('DOMContentLoaded', function() {
    const planets = [
        'mercury',
        'venus',
        'earth',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune'
    ];
    // Hover event for the planets so their respective orbits gets highlighted when mousing over.
    const planetElements = document.querySelectorAll('.planet');
    
    if (planetElements.length > 0) {
        planetElements.forEach((planet, index) => {
            const orbit = planet.parentElement;  
            
            if (orbit && orbit.classList.contains('orbit')) {
                planet.addEventListener('mouseenter', function() {
                    orbit.style.border = '1px dashed white';
                });

                planet.addEventListener('mouseleave', function() {
                    orbit.style.border = '1px dashed rgba(255, 255, 255, 0.2)';
                });
            }
        });
    } else {
        console.log('Inga planeter funna.');
    }
});
// Function to grab the API-key
async function getApiKey() {
    try {
        
        const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': 'solaris-iOjmhjtgjqkZhp6HI',
            },
        });

        if (!response.ok) throw new Error("Kunde inte hämta API-nyckel");
        
        const data = await response.json();
        console.log(data);
        return data.key;     
    } catch (error) {
        console.error("Fel med att hämta API-nyckel:", error);
        throw error;
    }
}


getApiKey().then(key => console.log("API Key:", key));

// Function to fetch all celestial bodies from the API with a non-hardcoded API-key.
async function fetchCelestialBodies() {
    try {
        const response = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
            method: 'GET',
            headers: {
                'x-zocom': 'solaris-i0jmhtjgqKZhp6Hl'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.bodies;
        } else {
            console.error('Kunde inte hämta himlakroppar:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Fel med datahämtning:', error);
        return [];
    }
}

// Function to fetch specific planet.
async function fetchSpecificPlanet(planetName) {
    const celestialBodies = await fetchCelestialBodies();
    const specificPlanet = celestialBodies.find(body =>
        body.name.toLowerCase() === planetName.toLowerCase()
    );

    if (specificPlanet) {
        // Hide solar system when displaying information about a fetched celestial body.
        document.querySelector('.solar-system').style.display = 'none';
        
        // Show planet details
        const planetSection = document.getElementById('planet-details');
        planetSection.style.display = 'block';
        const planetSymbol = planetarySymbols[specificPlanet.name.toLowerCase()] || '';
        const planetClassName = `planet-${specificPlanet.name.toLowerCase()}`;
        // The info section that shows a visual representation of the celestial body and information about it.
        planetSection.innerHTML = `
            <button onclick="goBackToSolarSystem()" class="back-button">← Tillbaka till solsystemet</button>
            <figure class="planet-large planet-${specificPlanet.name.toLowerCase()}">
            </figure>
            <section class="planet-info">
                <h2>${planetSymbol} ${specificPlanet.name}</h2>
                <p><strong>Type:</strong> ${specificPlanet.type}</p>
                <p><strong>Latin Name:</strong> ${specificPlanet.latinName}</p>
                <p><strong>Rotation:</strong> ${specificPlanet.rotation} hours</p>
                <p><strong>Circumference:</strong> ${specificPlanet.circumference} km</p>
                <p><strong>Day Temperature:</strong> ${specificPlanet.temp.day} °C</p>
                <p><strong>Night Temperature:</strong> ${specificPlanet.temp.night} °C</p>
                <p><strong>Distance from Sun:</strong> ${specificPlanet.distance} km</p>
                <p><strong>Orbital Period:</strong> ${specificPlanet.orbitalPeriod} days</p>
                <p><strong>Description:</strong> ${specificPlanet.desc}</p>
                <p><strong>Moons:</strong> ${specificPlanet.moons.length}</p>
            </section>
        `;
    } else {
        displayNotFound();
    }
}

// Function to display "not found"- message.
function displayNotFound() {
    const planetSection = document.getElementById('planet-details');
    planetSection.style.display = 'block';
    planetSection.innerHTML = '<p>Inget hittades. Försök igen.</p>';
}

// Function to handle search.
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const planetName = searchInput.value.trim();
    
    if (planetName) {
        fetchSpecificPlanet(planetName);
    } else {
        displayNotFound();
    }
}

// Function to go back to solar system view.
function goBackToSolarSystem() {
    document.querySelector('.solar-system').style.display = 'block';
    document.getElementById('planet-details').style.display = 'none';
}

// CSS styling.
const styles = `
    #planet-details {
        display: none;
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }

    .back-button {
        padding: 10px 20px;
        margin-bottom: 20px;
        background: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .back-button:hover {
        background: #444;
    }

    .planet-info {
        color: white;
    }
`;

// Styles.
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Event listeners.
window.addEventListener('load', function() {
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }
});


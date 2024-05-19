        
        const container = document.querySelector('.container');
        const searchButton = document.querySelector('.search-box button');
        const weatherBox = document.querySelector('.weather-box');
        const weatherDetails = document.querySelector('.weather-details');
        const error404 = document.querySelector('.not-found');

        function updateContainerHeight() {
            const container = document.querySelector('.container');
            const contentHeight = container.scrollHeight;
            container.style.height = `${contentHeight}px`;
        }

        searchButton.addEventListener('click', () => {
            const APIKey = 'ebd7550c331eab7c94a49b748e5ea054'; // Replace with your OpenWeatherMap API key
            const cityInput = document.querySelector('.search-box input');
            const input = cityInput.value.trim();

            if (input === '') return;

            // Play search sound
            document.getElementById('search-sound').play();

            fetchCapitalCity(input, APIKey);
        });

        function fetchCapitalCity(input, APIKey) {
            fetch(`https://restcountries.com/v3.1/name/${input}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 404 || !data[0].capital) {
                        // If not a country or no capital city, treat as a city
                        fetchWeatherData(input, APIKey);
                    } else {
                        const capitalCity = data[0].capital[0];
                        fetchWeatherData(capitalCity, APIKey);
                    }
                })
                .catch(() => {
                    // If error in fetching country data, treat as a city
                    fetchWeatherData(input, APIKey);
                });
        }

        function fetchWeatherData(city, APIKey) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
                .then(response => response.json())
                .then(json => {
                    if (json.cod === '404') {
                        displayError();
                        return;
                    }
                    updateWeatherInfo(json);
                    fetchTimeData(json.coord.lat, json.coord.lon);
                })
                .catch(displayError);
        }

        function fetchTimeData(lat, lon) {
            fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=WS69XSSKF3BT&format=json&by=position&lat=${lat}&lng=${lon}`)
                .then(response => response.json())
                .then(updateTimeInfo)
                .catch(error => console.error('Error fetching time data:', error));
        }

        function displayError() {
            error404.classList.add('active');
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            
        }
		

        function updateWeatherInfo(json) {
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.info-humidity span');
            const wind = document.querySelector('.info-wind span');

            

            let soundId;
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    soundId = 'clear-sound';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    soundId = 'rain-sound';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    soundId = 'snow-sound';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    soundId = 'clouds-sound';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    soundId = 'haze-sound';
                    break;
                    case 'Mist':
                    image.src = 'images/mist.png';
                    soundId = 'haze-sound';
                    break;
                default:
                    image.src = '';
            }

            if (soundId) {
                document.getElementById(soundId).play();
            }

            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${Math.round(json.wind.speed)}Km/h`;

            // Trigger fade-in effect
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            void weatherBox.offsetWidth; // Trigger reflow
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active');
        }

        function stopWeatherSounds() {
            const sounds = document.querySelectorAll('audio[id$="-sound"]');
            sounds.forEach(sound => {
                sound.pause();
                sound.currentTime = 0;
            });
        }

        function updateTimeInfo(json) {
            const timeElement = document.querySelector('.info-time span');
            const dateTime = new Date(json.formatted);
            let hours = dateTime.getHours();
            const minutes = dateTime.getMinutes();

            // Format time manually
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            timeElement.innerHTML = formattedTime;

            // Change background gradient based on the time of the day
            let gradient;

            if (hours >= 6 && hours < 12) {
                // Morning: 6 AM to 12 PM
                gradient = 'linear-gradient(135deg, #fbc2eb, #a6c1ee)';
            } else if (hours >= 12 && hours < 17) {
                // Noon: 12 PM to 5 PM
                gradient = 'linear-gradient(135deg, #FFD700, #FFA500)';
            } else if (hours >= 17 && hours < 20) {
                // Evening: 5 PM to 8 PM
                gradient = 'linear-gradient(135deg, #ff7e5f, #feb47b)';
            } else {
                // Night: 8 PM to 6 AM
                gradient = 'linear-gradient(135deg, #1E3C72, #000)';
            }

            document.body.style.background = gradient;

            // Trigger fade-in effect
            weatherDetails.classList.remove('active');
            void weatherDetails.offsetWidth; // Trigger reflow
            weatherDetails.classList.add('active');
        }
		document.addEventListener("DOMContentLoaded", function() {
    // Play loading sound when the DOM content is fully loaded
    var loadingSound = document.getElementById('loading-sound');
    loadingSound.play();
});
    
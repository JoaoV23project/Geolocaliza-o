var weatherInfos = []; 

async function loadMap() {
    var map = L.map('map').setView([-10.92580585643559, -37.07258957885154], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.locate().addTo(map);

    var markers = [
        /*SESI CEFEM*/
        L.marker([-10.922406, -37.081211]).addTo(map),
        /*Uma casa*/
        L.marker([-10.897682, -37.063221]).addTo(map),
        /*SENAI CETAF-AJU*/
        L.marker([-10.949746, -37.070977]).addTo(map)
    ];
    
    for (const marker of markers) {
        const lat = marker.getLatLng().lat.toFixed(4);
        const lng = marker.getLatLng().lng.toFixed(4);
        
        const weather = await getWeatherInfo(lat, lng);
    
        if (weather && weather.name) {
            marker.bindPopup(`
                Nome: ${weather.name}<br>
                ${capitalizeFirstLetter(weather.weather[0].description)}<br>
                Temperatura: ${weather.main.temp}°C<br>
                Umidade: ${weather.main.humidity}%
            `);
            
            weatherInfos.push(weather);
        } else {
            marker.bindPopup(`Erro ao carregar dados`);
        }
    }

    var popup = L.popup();
    async function onMapClick(e) {
        popup.setLatLng(e.latlng);

        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);
        
        const weather = await getWeatherInfo(lat, lng);
    
        if (weather && weather.name) {
            popup.bindPopup();
            popup
                .setLatLng(e.latlng)
                .setContent(`
                    ${weather.name}<br>
                    ${capitalizeFirstLetter(weather.weather[0].description)}<br>
                    Temperatura: ${weather.main.temp}°C<br>
                    Umidade: ${weather.main.humidity}%
                `)
                .openOn(map);

            weatherInfos.push(weather);
        } else {
            popup
                .setLatLng(e.latlng)
                .setContent("Erro ao carregar os dados")
                .openOn(map);
        }
    }

    map.on('click', onMapClick);
}

async function getWeatherInfo(lat, lng) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&lang=pt_br&units=metric&appid=56e2b5361c4287923509469c42e794f3`);
        
        if (!response.ok) {
            console.error("Erro na API:", response.status);
            return null;
        }

        const weather = await response.json();
        return weather; 
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
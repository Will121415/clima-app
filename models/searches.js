const fs = require('fs');

const axios = require('axios');

class Searches {

 
    places = []; 
    filePath = './db/history.json';
    constructor() {
        this.loadHistory();
    }

    get historyCapitalize() {
        return this.places.map(place => 
            place.replace(/\w\S*/g, c => {
                return c.charAt(0).toUpperCase() + c.substr(1).toLowerCase()
            }
        ));
    }

    get mapboxParams() {
        return {
            'limit': 5,
            'language': 'es'.replace(),
            'access_token': process.env.MAPBOX_TOKEN
        }
    }

    get openWeatherParams() {
        return {
            appid: process.env.OPENWEATHER_APIKEY,
            lang: 'es', 
            units: 'metric'
        }
    }


    async place(searchTerm = '') {
        try {
 
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ searchTerm }.json`,
                params: this.mapboxParams
            })

            const { data } = await instance.get();

            return data.features.map(f => ({
                id: f.id,
                name: f.place_name,
                lon: f.center[0],
                lat: f.center[1]
            }));

        } catch (error) {
            console.log(error);
            
            return [];
        }
    }

    async weather({lat, lon}) {

        try {
            const instance = axios.create({
                baseURL:'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.openWeatherParams, lat, lon},
            })
    
            const { data} = await instance.get();
    
            const { temp,temp_min, temp_max } = data.main;
    
            return {
                desc: data.weather[0].description,
                temp,
                temp_min, 
                temp_max
            }
        } catch (error) {
            console.log('Error: ', error);
            return [];
        }
        
        
    }

    addHistory({name = ''}) {

        const namePlace = name.toLowerCase();

        if (this.places.includes(namePlace)) return;
        
        this.places = this.places.splice(0,4);
        this.places.unshift(namePlace);
    }

    saveHistoy() {

        try {
            const payload = {
                history: this.places
            }
            fs.writeFileSync(this.filePath, JSON.stringify(payload));
        } catch (error) {
            console.log(error.message);
        }
    }

    loadHistory() {

        try {
            if (!fs.existsSync(this.filePath)) return;        
            const info = fs.readFileSync(this.filePath, { encoding: 'utf-8'})
            const { history } = JSON.parse(info);
            
            this.places = history;
            
        } catch (error) {
            console.log(error.message);
            
        }

        
    }

}

module.exports = Searches;
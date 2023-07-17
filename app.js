require('dotenv').config();

const { readInput, inquirerMenu, pause, showPlacesList } = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async() => {
    
    const search = new Searches();
    let option;

    do {
        option = await inquirerMenu();

        switch(option) {
            case 1: {
                console.clear();
                const searchTerm = await readInput('Ingrese lugar: ');
                const places = await search.place(searchTerm);
                const id = await showPlacesList(places);

                if(id === '0') continue;
                const placeSelected = places.find(p => p.id === id);

                search.addHistory(placeSelected);
                search.saveHistoy();
                
                const weatherData = await search.weather(placeSelected);

                console.clear();
                console.log('Información del lugar\n'.green);
                console.log('Lugar: ', placeSelected.name);
                console.log('Latitud:', placeSelected.lat);
                console.log('Longitud:', placeSelected.lon);
                console.log('Temperatura:', weatherData.temp);
                console.log('Máxima:', weatherData.temp_max);
                console.log('Mínima:', weatherData.temp_min);
                console.log('Cómo está el clima:', weatherData.desc?.green);

                break;
            } 
            case 2: {

                console.clear();
                console.log('Historial de busquedas\n'.green);
                
                search.historyCapitalize.forEach((place, index) => {
                    console.log(`${++index}.`.green,`${place}`);
                })
                break;
            }
        }
        
        
        (option !== 0) && await pause()

    } while( option !== 0 );
}


main();
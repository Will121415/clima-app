const inquirer = require('inquirer');
require('colors');

const { choices } = require('../data/choices');


const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Que desea hacer?',
        choices
    }
]

const inquirerMenu = async () => {

    console.clear();

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pause = async () => {
    console.log();
    
    await inquirer.prompt([
        {
            type: 'input',
            name: 'option',
            message: `Presione ${'ENTER'.green} para continuar...`
        }
    ]);

}

const readInput = async (message = '') => {

    const questions = [
        {
            type: 'input',
            name: 'value',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Debe ingresar algún valor';
                }
                return true;
            }
        }
    ]

    const { value } = await inquirer.prompt(questions);

    return value;
}

const showPlacesList = async (palces = []) => {

    const choices = palces.map(({ id, name }, index) => {
        return {
            value: id,
            name: `${index + 1}.`.green + ` ${name}`
        }
    })

    choices.unshift({ value: '0', name: `${'0'.green} Salir` });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt(questions);

    return id;
}


module.exports = { inquirerMenu, pause, readInput, showPlacesList }
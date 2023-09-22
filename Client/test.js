const {clientApplication} = require('./client')

let ManufacturerClient = new clientApplication();

ManufacturerClient.generateAndSubmitTxn(
    "exporter",
    "Admin",
    "coffeechannel",
    "Coffee-Supply",
    "CoffeeContract",
    "createCoffee",
    "Coffee01",
    "Hatchback",
    "Nexon",
    "Blue",
    "21/07/2021",
    "1"
).then(message => {
    console.log(message.toString());
})
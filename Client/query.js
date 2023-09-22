const {clientApplication} = require('./client')

let ManufacturerClient = new clientApplication()

ManufacturerClient.generateAndEvaluateTxn(
    "exporter",
    "Admin",
    "coffeechannel",
    "Coffee-Supply",
    "CoffeeContract",
    "readCoffee",
    "Coffee01"
).then(message => {
    console.log(message.toString())
})
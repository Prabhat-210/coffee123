const { EventListener } = require('./events')

let ManufacturerEvent = new EventListener();
ManufacturerEvent.txnEventListener("exporter", "Admin", "coffeechannel",
    "Coffee-Supply", "CoffeeContract", "createCoffee",
    "Coffee073", "Sedan", "Honda City", "White", "11/05/2021", "Honda");
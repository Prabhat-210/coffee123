const { EventListener } = require('./events')

let ManufacturerEvent = new EventListener();
ManufacturerEvent.contractEventListener("exporter", "Admin", "coffeechannel",
    "Coffee-Supply", "CoffeeContract", "addCoffeeEvent");
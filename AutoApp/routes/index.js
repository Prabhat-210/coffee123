var express = require('express');
var router = express.Router();
const {clientApplication} = require('./client');
const {Events} = require('./events')
let eventClient = new Events()
eventClient.contractEventListner("exporter", "Admin", "coffeechannel",
"Coffee-Supply", "CoffeeContract", "addCoffeeEvent")



/* GET home page. */
router.get('/', function(req, res, next) {
  let processorClient = new clientApplication();
 
  processorClient.generatedAndEvaluateTxn(
      "processor",
      "Admin",
      "coffeechannel", 
      "Coffee-Supply",
      "CoffeeContract",
      "queryAllCoffees"
  )
  .then(coffees => {
    const dataBuffer = coffees.toString();
    console.log("coffees are ", coffees.toString())
    const value = JSON.parse(dataBuffer)
    console.log("History DataBuffer is",value)
    res.render('index', { title: 'Coffee Supply Chain', itemList: value});
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
  })
});
 
router.get('/exporter', function(req, res, next) {
  let exporterClient = new clientApplication();
  exporterClient.generatedAndEvaluateTxn(
    "exporter",
    "Admin",
    "coffeechannel",
    "Coffee-Supply",
    "CoffeeContract",
    "queryAllCoffees"
  ).then(coffees =>{
    const data =coffees.toString();
    const value = JSON.parse(data)
    res.render('exporter', { title: 'Exporter', itemList: value });
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
  })

});
router.get('/importer', function(req, res, next) {
  res.render('importer', { title: 'Importer' });
});

router.get('/event', function(req, res, next) {
  console.log("Event Response %%%$$^^$%%$",eventClient.getEvents().toString())
  var event = eventClient.getEvents().toString()
  res.send({coffeeEvent: event})
  // .then(array => {
  //   console.log("Value is #####", array)
  //   res.send(array);
  // }).catch(err => {
  //   console.log("errors are ", err)
  //   res.send(err)
  // })
  // res.render('index', { title: 'Importer' });
});


router.get('/processor', function(req, res, next) {
  let processorClient = new clientApplication();
  processorClient.generatedAndEvaluateTxn(
    "processor",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "queryAllCoffees"
  )
  .then(coffees => {
    const dataBuffer = coffees.toString();
    console.log("coffees are ", coffees.toString())
    const value = JSON.parse(dataBuffer)
    console.log("History DataBuffer is",value)
    res.render('processor', { title: 'Processor', itemList: value});
  }).catch(err => {
    res.render("error", {
      message: `Some error occured`,
      callingScreen: "error",
    })
})});



router.get('/addCoffeeEvent', async function(req, res, next) {
  let processorClient = new clientApplication();
  const result = await processorClient.contractEventListner("exporter", "Admin", "coffeechannel", 
  "Coffee-Supply", "addCoffeeEvent")
  console.log("The result is ####$$$$",result)
  res.render('exporter', {view: "coffeeEvents", results: result })
})

router.post('/manuwrite',function(req,res){

  const vin = req.body.VinNumb;
  const make = req.body.CoffeeMake;
  const model = req.body.CoffeeModel;
  const color = req.body.CoffeeColor;
  const DOM = req.body.DOM;
  const flag = req.body.CoffeeFlag;

  // console.log("Request Object",req)
  let ManufacturerClient = new clientApplication();
  
  ManufacturerClient.generatedAndSubmitTxn(
      "exporter",
      "Admin",
      "coffeechannel", 
      "Coffee-Supply",
      "CoffeeContract",
      "createCoffee",
      vin,make,model,color,DOM,flag
    ).then(message => {
        console.log("Message is $$$$",message)
        res.status(200).send({message: "Added Coffee"})
      }
    )
    .catch(error =>{
      console.log("Some error Occured $$$$###", error)
      res.status(500).send({error:`Failed to Add`,message:`${error}`})
    });
});

router.post('/manuread',async function(req,res){
  const Qvin = req.body.QVinNumb;
  let ManufacturerClient = new clientApplication();
  
  ManufacturerClient.generatedAndEvaluateTxn( 
    "exporter",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "readCoffee", Qvin)
    .then(message => {
      
      res.status(200).send({ Coffeedata : message.toString() });
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to Add`,message:`${error}`})
    });

 })

 //  Get History of a coffee
 router.get('/itemhistory',async function(req,res){
  const coffeeId = req.query.coffeeId;
 
  let processorClient = new clientApplication();
  
  processorClient.generatedAndEvaluateTxn( 
    "exporter",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "getCoffeesHistory", coffeeId).then(message => {
    const dataBuffer = message.toString();
    
    const value = JSON.parse(dataBuffer)
    res.render('history', { itemList: value , title: "Coffee History"})

  });

 })

 //Register a coffee

 router.post('/registerCoffee',async function(req,res){
  const Qvin = req.body.QVinNumb;
  const CoffeeOwner = req.body.coffeeOwner;
  const RegistrationNumber = req.body.regNumber
  let MVDClient = new clientApplication();
  
  MVDClient.generatedAndSubmitTxn( 
    "processor",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "registerCoffee", Qvin,CoffeeOwner,RegistrationNumber)
    .then(message => {
    
      res.status(200).send("Successfully created")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to create`,message:`${error}`})
    });

 })
// Create order
router.post('/createOrder',async function(req,res){
  const orderNumber = req.body.orderNumber;
  const coffeeMake = req.body.coffeeMake;
  const coffeeModel = req.body.coffeeModel;
  const coffeeColour = req.body.coffeeColour;
  const ImporterName = req.body.ImporterName
  let DealerClient = new clientApplication();

  const transientData = {
    make: Buffer.from(coffeeMake),
    model: Buffer.from(coffeeModel),
    color: Buffer.from(coffeeColour),
    ImporterName: Buffer.from(ImporterName)
  }
  
  DealerClient.generatedAndSubmitPDC( 
    "importer",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "OrderContract",
    "createOrder", orderNumber,transientData)
    .then(message => {
      
      res.status(200).send("Successfully created")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to create`,message:`${error}`})
    });

 })

 router.post('/readOrder',async function(req,res){
  const orderNumber = req.body.orderNumber;
  let DealerClient = new clientApplication();
  DealerClient.generatedAndEvaluateTxn( 
    "importer",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "OrderContract",
    "readOrder", orderNumber).then(message => {
   
    res.send({orderData : message.toString()});
  }).catch(error => {
    alert('Error occured')
  })

 })

 //Get all orders
 router.get('/allOrders',async function(req,res){
  let DealerClient = new clientApplication();
  DealerClient.generatedAndEvaluateTxn( 
    "importer",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "OrderContract",
    "queryAllOrders","").then(message => {
    const dataBuffer = message.toString();
    const value = JSON.parse(dataBuffer);
    res.render('orders', { itemList: value , title: "All Orders"})
    }).catch(error => {
    //alert('Error occured')
    console.log(error)
  })

 })
 //Find matching orders
 router.get('/matchOrder',async function(req,res){
  const coffeeId = req.query.coffeeId;
 
  let processorClient = new clientApplication();
  
  processorClient.generatedAndEvaluateTxn( 
    "exporter",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "checkMatchingOrders", coffeeId).then(message => {
    console.log("Message response",message)
    var dataBuffer = message.toString();
    var data =[];
    data.push(dataBuffer,coffeeId)
    console.log("checkMatchingOrders",data)
    const value = JSON.parse(dataBuffer)
    let array = [];
    if(value.length) {
        for (i = 0; i < value.length; i++) {
            array.push({
               "orderId": `${value[i].Key}`,"coffeeId":`${coffeeId}`,
                "Make": `${value[i].Record.make}`, "Model":`${value[i].Record.model}`, 
                "Color":`${value[i].Record.color}`, 
                "ImporterName": `${value[i].Record.ImporterName}`,"assetType": `${value[i].Record.assetType}`
            })
        }
    }
    console.log("Array value is ", array)
    console.log("Coffee id sent",coffeeId)
    res.render('matchOrder', { itemList: array , title: "Matching Orders"})

  });

 })

 router.post('/match',async function(req,res){
  const orderId = req.body.orderId;
  const coffeeId = req.body.coffeeId
  let DealerClient = new clientApplication();
  DealerClient.generatedAndSubmitTxn( 
    "importer",
    "Admin",
    "coffeechannel", 
    "Coffee-Supply",
    "CoffeeContract",
    "matchOrder", coffeeId,orderId).then(message => {
   
      res.status(200).send("Successfully Matched order")
    }).catch(error =>{
     
      res.status(500).send({error:`Failed to Match Order`,message:`${error}`})
    });

 })



module.exports = router;



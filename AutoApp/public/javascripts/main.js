
function toManuDash() {
    window.location.href='/exporter';
}

function swalBasic(data) {
    swal.fire({
        // toast: true,
        icon: `${data.icon}`,
        title: `${data.title}`,
        animation: true,
        position: 'center',
        showConfirmButton: true,
        footer: `${data.footer}`,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
        }
    })
}

// function swalDisplay(data) {
//     swal.fire({
//         // toast: true,
//         icon: `${data.icon}`,
//         title: `${data.title}`,
//         animation: false,
//         position: 'center',
//         html: `<h3>${JSON.stringify(data.response)}</h3>`,
//         showConfirmButton: true,
//         timer: 3000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//             toast.addEventListener('mouseenter', swal.stopTimer)
//             toast.addEventListener('mouseleave', swal.resumeTimer)
//         }
//     }) 
// }

function reloadWindow() {
    window.location.reload();
}

function ManWriteData(){
    event.preventDefault();
    const vin = document.getElementById('vinNumber').value;
    const make = document.getElementById('coffeeMake').value;
    const model = document.getElementById('coffeeModel').value;
    const color = document.getElementById('coffeeColour').value;
    const dom = document.getElementById('dom').value;
    const flag = document.getElementById('manName').value;
    console.log(vin+make+model+color+dom+flag);

    if (vin.length==0||make.length==0||model.length==0||color.length==0||dom.length==0||flag.length==0) {
        const data = {
            title: "You might have missed something",
            footer: "Enter all mandatory fields to add a new coffee",
            icon: "warning"
        }
        swalBasic(data);
        }
    else{
        fetch('/manuwrite',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({VinNumb: vin, CoffeeMake: make, CoffeeModel: model, CoffeeColor: color, DOM: dom, CoffeeFlag: flag})
        })
        .then(function(response){
            if(response.status == 200) {
                const data = {
                    title: "Success",
                    footer: "Added a new coffee",
                    icon: "success"
                }
                swalBasic(data);
            } else {
                const data = {
                    title: `Coffee with Vin Number ${vin} already exists`,
                    footer: "Vin Number must be unique",
                    icon: "error"
                }
                swalBasic(data);
            }

        })
        .catch(function(error){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);
        })    
    }
}
function ManQueryData(){

    event.preventDefault();
    const Qvin = document.getElementById('QueryVinNumbMan').value;
    
    console.log(Qvin);

    if (Qvin.length==0) {
        const data = {
            title: "Enter a Valid Qvin Number",
            footer: "This is a mandatory field",
            icon: "warning"
        }
        swalBasic(data)  
    }
    else{
        fetch('/manuread',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QVinNumb: Qvin})
        })
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function (Coffeedata){
            dataBuf = Coffeedata["Coffeedata"]
            swal.fire({
                // toast: true,
                icon: `success`,
                title: `Current status of coffee with Qvin ${Qvin} :`,
                animation: false,
                position: 'center',
                html: `<h3>${dataBuf}</h3>`,
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            }) 
        })
        .catch(function(error){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);        
        })    
    }
}

//Method to get the history of an item
function getItemHistory(coffeeId) {
    console.log("postalId", coffeeId)
    window.location.href = '/itemhistory?coffeeId=' + coffeeId;
}

function getMatchingOrders(coffeeId) {
    console.log("coffeeId",coffeeId)
    window.location.href = '/matchOrder?coffeeId=' + coffeeId;
}

function RegisterCoffee(){
    console.log("Entered the register function")
    event.preventDefault();
    const QVinNumb = document.getElementById('QVinNumb').value;
    const coffeeOwner = document.getElementById('coffeeOwner').value;
    const regNumber = document.getElementById('regNumber').value;
    console.log(QVinNumb+coffeeOwner+regNumber);

    if (QVinNumb.length==0||coffeeOwner.length==0||regNumber.length==0) {
        const data = {
            title: "You have missed something",
            footer: "All fields are mandatory",
            icon: "warning"
        }
        swalBasic(data)   
    }
    else{
        fetch('/registerCoffee',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',              
            },
            body: JSON.stringify({QVinNumb: QVinNumb, coffeeOwner: coffeeOwner, regNumber: regNumber})
        })
        .then(function(response){
            if(response.status === 200){
            const data = {
                title: `Registered coffee ${QVinNumb} to ${coffeeOwner}`,
                footer: "Registered coffee",
                icon: "success"
            }
            swalBasic(data)
            } else {
                const data = {
                    title: `Failed to register coffee`,
                    footer: "Please try again !!",
                    icon: "error"
                }
                swalBasic(data)           
            }
        })
        .catch(function(err){
            const data = {
                title: "Error in processing Request",
                footer: "Something went wrong !",
                icon: "error"
            }
            swalBasic(data);         
        })    
    }
}

function createOrder() {
    console.log("Entered the order function")
    event.preventDefault();
    const orderNumber = document.getElementById('orderNumber').value;
    const coffeeMake = document.getElementById('coffeeMake').value;
    const coffeeModel = document.getElementById('coffeeModel').value;
    const coffeeColour = document.getElementById('coffeeColour').value;
    const ImporterName = document.getElementById('ImporterName').value;
    console.log(orderNumber + coffeeColour + ImporterName);

    if (orderNumber.length == 0 || coffeeMake.length == 0 || coffeeModel.length == 0 
        || coffeeColour.length == 0|| ImporterName.length == 0) {
            const data = {
                title: "You have missed something",
                footer: "All fields are mandatory",
                icon: "warning"
            }
            swalBasic(data)  
    }
    else {
        fetch('/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderNumber: orderNumber, coffeeMake: coffeeMake, coffeeModel: coffeeModel, coffeeColour: coffeeColour,ImporterName: ImporterName })
        })
            .then(function (response) {
                if (response.status === 200) {
                    const data = {
                        title: `Order is created`,
                        footer: "Raised Order",
                        icon: "success"
                    }
                    swalBasic(data)

                } else {
                    const data = {
                        title: `Failed to create order`,
                        footer: "Please try again !!",
                        icon: "error"
                    }
                    swalBasic(data)                  }
            })
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);               
            })
    }
}

function readOrder() {
    console.log("Entered the order function")
    event.preventDefault();
    const orderNumber = document.getElementById('ordNum').value;
    
    console.log(orderNumber );

    if (orderNumber.length == 0) {
        const data = {
            title: "Enter a order number",
            footer: "Order Number is mandatory",
            icon: "warning"
        }
        swalBasic(data)     
    }
    else {
        fetch('/readOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderNumber: orderNumber})
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (orderData){
                dataBuf = orderData["orderData"]
                swal.fire({
                    // toast: true,
                    icon: `success`,
                    title: `Current status of Order : `,
                    animation: false,
                    position: 'center',
                    html: `<h3>${dataBuf}</h3>`,
                    showConfirmButton: true,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer)
                        toast.addEventListener('mouseleave', swal.resumeTimer)
                    }
                })           
            })
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);              
            })
    }
}

function matchOrder(orderId,coffeeId) {
    if (!orderId|| !coffeeId) {
        const data = {
            title: "Enter a order number",
            footer: "Order Number is mandatory",
            icon: "warning"
        }
        swalBasic(data)   
    } else {
        fetch('/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId,coffeeId})
        })
            .then(function (response) {
                if (response.status === 200) {
                    const data = {
                        title: `Order matched successfully`,
                        footer: "Order matched",
                        icon: "success"
                    }
                    swalBasic(data)
                } else {
                    const data = {
                        title: `Failed to match order`,
                        footer: "Please try again !!",
                        icon: "error"
                    }
                    swalBasic(data)                 }
            })
            
            .catch(function (err) {
                const data = {
                    title: "Error in processing Request",
                    footer: "Something went wrong !",
                    icon: "error"
                }
                swalBasic(data);  
            })
    }
}


function allOrders() {
    window.location.href='/allOrders';
}


function getEvent() {
    fetch('/event', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log("Response is ###",response)
            return response.json()
        })
        .then(function (event) {
            dataBuf = event["coffeeEvent"]
            swal.fire({
                toast: true,
                // icon: `${data.icon}`,
                title: `Event : `,
                animation: false,
                position: 'top-right',
                html: `<h5>${dataBuf}</h5>`,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            }) 
        })
        .catch(function (err) {
            swal.fire({
                toast: true,
                icon: `error`,
                title: `Error`,
                animation: false,
                position: 'top-right',
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', swal.stopTimer)
                    toast.addEventListener('mouseleave', swal.resumeTimer)
                }
            })        
        })
}
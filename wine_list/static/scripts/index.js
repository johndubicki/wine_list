$(document).ready(pageSetup());

function pageSetup(){
    console.log("page loaded");
}

function wineForm(){
    $("#cellar").hide();
    $("#add").fadeIn(400);
}

function viewCellar(){
    location.reload(true);
}

async function addWine(){
    data = {
        "quantity": $("#quantityDataList").val(),
        "vintage": $("#vintageDataList").val(),
        "size": $("#sizeDataList").val(),
        "category": $("#categoryDataList").val(),
        "varietal": $("#varietalDataList").val(),
        "name": $("#nameDataList").val(),
        "producer": $("#producerDataList").val(),
        "subregion": $("#subregionDataList").val(),
        "region": $("#regionDataList").val(),
        "country": $("#countryDataList").val(),
        "row": $("#rowDataList").val(),
        "position": $("#positionDataList").val()
    };
    let response = await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let status = await response.json();
    console.log(status);
    let message = document.getElementById('message');
    if(status['status'] === 'success'){
        message.className = 'text-success';
        message.innerText = 'Bottle(s) added!';
    }
    else {
        message.className = 'text-danger';
        message.innerText = 'Bottle(s) NOT added!';
    }
    await messageFader();
}

async function messageFader(){
    await $("#add").hide();
    await $("#flash").fadeIn(700);
    await new Promise(r => setTimeout(r, 1500));
    await $("#flash").fadeOut(700);
    await new Promise(r => setTimeout(r, 700));
    await $("#add").fadeIn(400);
}
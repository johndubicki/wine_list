$(document).ready(pageSetup());

function pageSetup(){
    console.log("page loaded");
}

function wineForm(){
    $("#cellar").hide();
    $("#add").fadeIn(400);
}

function viewCellar(){
    $("#add").hide();
    $("#cellar").fadeIn(400);
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
}
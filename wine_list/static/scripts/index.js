$( document ).ready(function() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    fetch("/options")
    .then(response => response.json())
    .then(options => {
        for ( let [k, v] of Object.entries(options) ) {
            let element = document.getElementById(k + 'Options');
            v.forEach(option => {
                if ( option.length > 0 ) {
                    let newOption = document.createElement('option');
                    newOption.value = option;
                    element.appendChild(newOption);
                }
            });
        }
    })
})

async function wineForm(){
    $("#cellar").fadeOut(350);
    $("#edit").fadeOut(350);
    $("#refreshButton").fadeOut(350);
    await new Promise(r => setTimeout(r, 350));
    $("#add").fadeIn(350);
}

async function viewCellar(refresh=false){
    if(refresh){
        location.reload(true);
    }
    else {
        $("#add").fadeOut(350);
        $("#edit").fadeOut(350);
        await new Promise(r => setTimeout(r, 350));
        $("#cellar").fadeIn(350);
        $("#refreshButton").fadeIn(350);
    }
}

function copyWine(id) {
    let parent = document.getElementById('wine' + id);
    let children = parent.children;
    for ( i=0; i<13; i++ ) {
        console.log(children[i].innerText);
    }
    // split the window

}

async function csvSearch(){
    $("#clearSearchButton").fadeIn(200);
    viewCellar();
    let search = document.getElementById('search');
    let data = {
        'terms': search.value
    }
    let response = await fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let respData = await response.json();
    if(respData['data'].length > 0) {
        let cellar = document.getElementById('cellarBody');
        cellar.innerHTML = '';
        respData['data'].forEach(wine => {
            let tr = document.createElement('tr');
            let quantity = document.createElement('td');
            quantity.innerText = wine.quantity;
            tr.appendChild(quantity);
            let vintage = document.createElement('td');
            vintage.innerText = wine.vintage;
            tr.appendChild(vintage);
            let size = document.createElement('td');
            size.innerText = wine.size;
            tr.appendChild(size);
            let category = document.createElement('td');
            category.innerText = wine.category;
            tr.appendChild(category);
            let varietal = document.createElement('td');
            varietal.innerText = wine.varietal;
            tr.appendChild(varietal);
            let name = document.createElement('td');
            name.innerText = wine.name;
            tr.appendChild(name);
            let producer = document.createElement('td');
            producer.innerText = wine.producer;
            tr.appendChild(producer);
            let subregion = document.createElement('td');
            subregion.innerText = wine.subregion;
            tr.appendChild(subregion);
            let region = document.createElement('td');
            region.innerText = wine.region;
            tr.appendChild(region);
            let country = document.createElement('td');
            country.innerText = wine.country;
            tr.appendChild(country);
            let window = document.createElement('td');
            window.innerText = wine.window_start + "-" + wine.window_end;
            tr.appendChild(window);
            let row = document.createElement('td');
            row.innerText = wine.row;
            tr.appendChild(row);
            let position = document.createElement('td');
            position.innerText = wine.position;
            tr.appendChild(position);
            cellar.appendChild(tr);
        });
    }
    else {
        console.log(respData);
        let cellar = document.getElementById('cellar');
        cellar.innerHTML = '<div style="height: 150px;"></div><h3 class="text-secondary">You have no matching wines.</h3>';
        await new Promise(r => setTimeout(r, 300));
        await $("#cellar").fadeOut(1500);
        await new Promise(r => setTimeout(r, 1500));
        viewCellar(refresh=true);
    }
}

function clearSearch() {
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
        "position": $("#positionDataList").val(),
        "window_start": $("#startDataList").val(),
        "window_end": $("#endDataList").val()
    };
    let response = await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let status = await response.json();
    let message = document.getElementById('message');
    if(status['status'] === 'success'){
        message.className = 'text-success';
        message.innerText = 'Bottle(s) added!';
    }
    else {
        message.className = 'text-danger';
        message.innerText = 'Bottle(s) NOT added!';
    }
    await addMessageFader();
}

async function deleteWine(id){
    let response = await fetch("/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    let status = await response.json();
    let message = document.getElementById('message');
    if(status['status'] === 'success'){
        message.className = 'text-success';
        message.innerText = 'Bottle(s) deleted!';
    }
    else {
        message.className = 'text-danger';
        message.innerText = 'Bottle(s) NOT deleted!';
    }
    await editMessageFader();
}

async function updateWine(id){
    data = {
        "quantity": $("#quantity").val(),
        "vintage": $("#vintage").val(),
        "size": $("#size").val(),
        "category": $("#category").val(),
        "varietal": $("#varietal").val(),
        "name": $("#name").val(),
        "producer": $("#producer").val(),
        "subregion": $("#subregion").val(),
        "region": $("#region").val(),
        "country": $("#country").val(),
        "row": $("#row").val(),
        "position": $("#position").val(),
        "window_start": $("#start").val(),
        "window_end": $("#end").val()
    };
    let response = await fetch("/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let status = await response.json();
    let message = document.getElementById('message');
    if(status['status'] === 'success'){
        message.className = 'text-success';
        message.innerText = 'Bottle(s) updated!';
    }
    else {
        message.className = 'text-danger';
        message.innerText = 'Bottle(s) NOT updated!';
    }
    await editMessageFader();
}

async function editWine(id){
    let updateButton = document.getElementById('updateButton');
    updateButton.onclick = function() { updateWine(id) };
    let deleteButton = document.getElementById('deleteButton');
    deleteButton.onclick = function() { deleteWine(id) };
    $("#refreshButton").fadeOut(350);
    $("#cellar").fadeOut(350);
    await new Promise(r => setTimeout(r, 350));
    $("#edit").fadeIn(350);
    let response = await fetch("/search/" + id)
    let respData = await response.json();
    console.log(respData);
    $("#quantity").val(respData['data']['quantity']);
    $("#vintage").val(respData['data']['vintage']);
    $("#size").val(respData['data']['size']);
    $("#category").val(respData['data']['category']);
    $("#varietal").val(respData['data']['varietal']);
    $("#name").val(respData['data']['name']);
    $("#producer").val(respData['data']['producer']);
    $("#subregion").val(respData['data']['subregion']);
    $("#region").val(respData['data']['region']);
    $("#country").val(respData['data']['country']);
    $("#start").val(respData['data']['window_start']);
    $("#end").val(respData['data']['window_end']);
    $("#row").val(respData['data']['row']);
    $("#position").val(respData['data']['position']);
}

async function addMessageFader(){
    $("#add").hide();
    $("#flash").fadeIn(700);
    await new Promise(r => setTimeout(r, 1500));
    $("#flash").fadeOut(700);
    await new Promise(r => setTimeout(r, 700));
    $("#add").fadeIn(400);
}

async function editMessageFader(){
    $("#edit").hide();
    $("#flash").fadeIn(700);
    await new Promise(r => setTimeout(r, 1500));
    $("#flash").fadeOut(700);
    await new Promise(r => setTimeout(r, 700));
    viewCellar(refresh=true);
}
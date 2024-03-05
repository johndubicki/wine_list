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

async function csvSearch(){
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
            console.log(wine);
            // DRAW TABLE ROWS HERE
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

async function editWine(id){
    $("#refreshButton").fadeOut(350);
    $("#cellar").fadeOut(350);
    await new Promise(r => setTimeout(r, 350));
    $("#edit").fadeIn(350);
    let response = await fetch("/search/" + id)
    let respData = await response.json();
    console.log(respData);
}

async function messageFader(){
    $("#add").hide();
    $("#flash").fadeIn(700);
    await new Promise(r => setTimeout(r, 1500));
    $("#flash").fadeOut(700);
    await new Promise(r => setTimeout(r, 700));
    $("#add").fadeIn(400);
}
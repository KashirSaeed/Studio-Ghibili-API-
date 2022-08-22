var mainElement = document.querySelector("main")
var filmData;
var navLinks = document.querySelectorAll("#mainnav ul li a")
var dataSet = "films"
var url = "https://ghibliapi.herokuapp.com/films"


async function getData(url) {
    var dataPromise = await fetch(url)
    var data = await dataPromise.json()

    if(dataSet === "films"){
        mainElement.innerHTML = ""
        sorting(data)
        addingCards(data)
        filmData = data
        document.getElementById("sortorder").removeAttribute("disabled")
        document.querySelector("nav form").style.visibility = "visible"
    }
    else{
        mainElement.innerHTML = ""
        addingCards(data)
        document.querySelector("nav form").style.visibility = "hidden"

    }
   


}
getData(url)

document.getElementById("sortorder").addEventListener("change", function () {
    mainElement.innerHTML = ""
    sorting(filmData)
    addingCards(filmData)

})

function addingCards(array) {
    array.forEach( function(eachFilm)  {
         creatingCards(eachFilm)
    });
}

function sorting(array) {
    var sortingType = document.getElementById("sortorder").value;
    // alert(sortingType)
    switch (sortingType) {
        case "title": array.sort((a, b) => (a.title > b.title) ? 1 : -1); break;
        case "release_date": array.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1); break;
        case "rt_score": array.sort((a, b) => (parseInt(a.rt_score) > parseInt(b.rt_score)) ? -1 : 1); break;

    }
}


async function creatingCards(data) {
    var card = document.createElement("article")
    switch(dataSet){
        case "films": card.innerHTML =  filmCardContent(data); break;
        case "people": card.innerHTML =  await peopleCardContent(data); break;
        case "locations": card.innerHTML =  await locationCardContent(data); break;
        case "species": card.innerHTML =  await specieCardContent(data); break;
        case "vehicles": card.innerHTML =  await vehicleCardContent(data); break;


    }
    mainElement.appendChild(card)
}

function filmCardContent(data) {
    var html = `<h2>${data.title}</h2>`
    html += ` <p> <strong>Director:  </strong> ${data.director} </p> `
    html += `  <p> <strong>Released:  </strong> ${data.release_date} </p>  `
    html += `  <p>${data.description} </p>  `
    html += `  <p> <strong>Rotton Tomatoes Scores:   </strong>  ${data.rt_score} </p>  `
    return html;

}

async function peopleCardContent(data) {
    var tempFilms = data.films
    var filmTittlesArray = [];
    for(everyFilm of tempFilms){
        var tempTittle = await indivItem(everyFilm , "title")
        filmTittlesArray.push(tempTittle)
    }

    var specie = await indivItem(data.species , "name")
    var html = `<h2> ${data.name}  </h2>`
    html += `<p> <strong> Details:  </strong> Gender: ${data.gender} age: ${data.age} Eye Color: ${data.eye_color} Hair Color: ${data.hair_color} </p>`
    html += `<p> <strong> Films:  </strong> ${filmTittlesArray.join(', ')} </p>`
    html += `<p> <strong> Species:  </strong> ${specie} </p>`
    return html

}

async function locationCardContent(data){
    var tempFilms = data.films
    var filmTittlesArray = [];
    for(everyFilm of tempFilms){
        var tempTittle = await indivItem(everyFilm , "title")
        filmTittlesArray.push(tempTittle)
    }

    var regex = "https?:\/\/"
    var tempResidents = data.residents
    var residentsArray = []
    for(eachResident of tempResidents){
        if(eachResident.match(regex)){
            var residentName = await indivItem(eachResident , "name")
            residentsArray.push(residentName)
        }
        else{
            residentsArray.push("no data available")
        }

    }

    var html = ` <h2>${data.name}</h2> `
    html += ` <p> <strong> Details: </strong> climate: ${data.climate} terrain: ${data.terrain} surface water: ${data.surface_water} </p> `
    html += `<p> <strong> Films:  </strong> ${filmTittlesArray.join(', ')} </p>`
    html += `<p> <strong> Residents:  </strong> ${residentsArray.join(', ')} </p>`
    return html
}

async function specieCardContent(data){
    var tempFilms = data.films
    var filmTittlesArray = [];
    for(everyFilm of tempFilms){
        var tempTittle = await indivItem(everyFilm , "title")
        filmTittlesArray.push(tempTittle)
    }

    var tempPeople = data.people
    var peopleArray = []
    for(eachPeople of tempPeople){
        var tempHuman = await indivItem(eachPeople , "name")
        peopleArray.push(tempHuman)
    }

    var html = `<h2> ${data.name} </h2>`
    html += `<p> <strong> Classification: </strong> ${data.classification} </p>`
    html += `<p> <strong> Eye Color: </strong> ${data.eye_colors} </p>`
    html += `<p> <strong> Hair Color: </strong> ${data.hair_colors} </p>`
    html += `<p> <strong> Films:  </strong> ${filmTittlesArray.join(', ')} </p>`
    html += `<p> <strong> People:  </strong> ${peopleArray.join(', ')} </p>`
    return html
}

async function vehicleCardContent(data){
    var html = `<h2> ${data.name} </h2>`
    html += `<p> <strong> Description: </strong> ${data.description} </p>`
    html += `<p> <strong>Vehicle Class: </strong> ${data.vehicle_class} </p>`
    html += `<p> <strong>Lenght: </strong> ${data.lenght} </p>`
    html += `<p> <strong> Pilot: </strong> ${ await indivItem(data.pilot , "name") } </p>`
    html += `<p> <strong> Film: </strong> ${  await indivItem(data.films , "title") } </p>`
    return html

}

async function indivItem(url, item) {
    var theItem;
    try{
        var fetchPromise = await fetch(url)
        var data = await fetchPromise.json()
        theItem = data[item]
    }
    catch{
        theItem = "No data available"
    }
    finally{
        return theItem
    }

}

navLinks.forEach(function(eachLink){
    eachLink.addEventListener("click" , function(event){
        event.preventDefault()
        var selectedLink = event.target.getAttribute("href").substring(1)
        dataSet = selectedLink
        url = `https://ghibliapi.herokuapp.com/${selectedLink}`
        getData(url)
        
    } )
})


// function creatingCards(data){
//     var card = document.createElement("article")

//     var cardTittle = document.createElement("h2")
//     var cardTittleText = document.createTextNode(data.title)
//     cardTittle.appendChild(cardTittleText)
//     card.appendChild(cardTittle)

//     var director = document.createElement("p")
//     var directorText = document.createTextNode(`Director:  ${data.director}`)
//     director.appendChild(directorText)
//     card.appendChild(director)

//     var released = document.createElement("p")
//     var releasedText = document.createTextNode(`Released:  ${data.release_date}`)
//     released.appendChild(releasedText)
//     card.appendChild(released)

//     var description = document.createElement("p")
//     var descriptionText = document.createTextNode(data.description)
//     description.appendChild(descriptionText)
//     card.appendChild(description)

//     var rt_Score = document.createElement("p")
//     var rt_ScoreText = document.createTextNode(`Rotton Tomatoes Scores:  ${data.rt_score}`)
//     rt_Score.appendChild(rt_ScoreText)
//     card.appendChild(rt_Score)


//     mainElement.appendChild(card)
// }


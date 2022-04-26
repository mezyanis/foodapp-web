const http = require("https");
const express = require('express')
const fetch = require("node-fetch");
const model = require('./model')


let app = express()

app.get("/:adress", async(req, res) => {

    //retourne toute les infos sur l'adress passée en parametre
    let user_adress = req.params.adress
    let api_url = `https://api-adresse.data.gouv.fr/search/?q=${user_adress}`
    let response = await fetch(api_url)
    let user_data = await response.json()

    //retourne toute les données sur la restaurant 
    let resto = model.return_restaurant()
    let resto_adress = resto.adress
    let api_url2 = `https://api-adresse.data.gouv.fr/search/?q=${resto_adress}`
    let response_resto = await fetch(api_url2)
    let resto_data = await response_resto.json()


    let user_coord = user_data.features[0].geometry.coordinates
    let resto_coord = resto_data.features[0].geometry.coordinates


    //retourne la distance et le temps que prendra le voyage 
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com',
            'X-RapidAPI-Key': 'acb9a3c9bfmsha48edd8b6c5047ap1075cdjsn5629b61b4d95'
        }
    };

    let api_distance = `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${user_coord[1]},${user_coord[0]}&destinations=${resto_coord[1]},${resto_coord[0]}`
    let res_distance = await fetch(api_distance, options)
    let distance = await res_distance.json()

    res.json(distance)
})



app.listen(3000, () => { console.log("server is running.."); })
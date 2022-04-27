"use strict"

//dependences 
const express = require("express")
const fetch = require('node-fetch')
const path = require('path');
const model = require('./model')
let app = express()
    //app.set('view engine', 'html');
    //app.set('views', './views');


app.use(express.static('views'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))
})


app.get("/search", async(req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))

    //retourne toute les infos sur l'adress passée en parametre
    const geocoding_options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': 'acb9a3c9bfmsha48edd8b6c5047ap1075cdjsn5629b61b4d95'
        }
    };

    let user_adress = req.query.adress
    let api_url = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${user_adress}&language=en`
    let response = await fetch(api_url, geocoding_options)
    let user_data = await response.json()

    //retourne toute les données sur la restaurant 
    let resto = model.return_restaurant()
    let resto_adress = resto.adress
    let api_url2 = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${resto_adress}&language=en`
    let response_resto = await fetch(api_url2, geocoding_options)
    let resto_data = await response_resto.json()


    let user_coord = user_data.results[0].location
    let resto_coord = resto_data.results[0].location


    //retourne la distance et le temps que prendra le voyage 
    const dist_options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com',
            'X-RapidAPI-Key': 'acb9a3c9bfmsha48edd8b6c5047ap1075cdjsn5629b61b4d95'
        }
    };

    let api_distance = `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${user_coord.lat},${user_coord.lng}&destinations=${resto_coord.lat},${resto_coord.lng}`
    let res_distance = await fetch(api_distance, dist_options)
    let distance = await res_distance.json()

    console.log(distance);
    console.log("1");
    //res.json(distance)
})
app.listen(3000, () => { console.log("server is running.."); })
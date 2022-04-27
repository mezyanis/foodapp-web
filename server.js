"use strict"
//npm start = lancer le server
//dependences 
const express = require("express")
const mustache = require('mustache-express')
const fetch = require('node-fetch')
const path = require('path');
const model = require('./model')
let app = express()

// parse form arguments in POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


app.use(express.static('views'))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))

    //console.log("1");
    //res.json(distance)*/
})

app.get('/login', (req, res) => {
    res.render('login.html')
})

app.get('/new_user', (req, res) => {
    res.render('new_user')
})

app.post('/login', (req, res) => {
    let id = model.login(req.body.username, req.body.password)
    if (id != -1) {
        req.session.username = req.body.username
        req.session.id = id
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})

app.get('/search', (req, res) => {
    let user_adress = req.query.adress
    let resto = model.return_restaurant()
    console.log(req.query.adress);

    if (user_adress != '' && user_adress != undefined) {
        (async() => {

            //retourne toute les infos sur l'adress passée en parametre
            let user_data = await getGeoCode(user_adress)


            //retourne toute les données sur la restaurant 
            let resto_data = await getGeoCode(resto.adress)

            console.log(user_data);


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

            res.render('restaurant', { distance: distance })
        })()



    } else {
        console.log("error");
        res.redirect('/')
    }


})

app.post('/logout', (req, res) => {
    req.session = null
    res.redirect('/')

})

app.post('/sign_in', (req, res) => {
    req.session.id = model.new_user(req.body.username, req.body.password)
    req.session.username = req.body.username
    res.redirect('/')

})




//middlewares 
function is_authenticated(req, res, next) {
    if (req.session.id == undefined || req.session.id == null) {
        console.log(req.session);
        res.writeHead(401)
        res.end('Accès non autorisé')
        return
    }
    next()
}

function authicatedView(req, res, next) {
    res.locals = {
        authenticated: false,
        name: ''
    }

    if (req.session.id != undefined && req.session.id != null) {
        res.locals.authenticated = true
        res.locals.name = req.session.username
    }
    console.log('loc', res.locals);
    console.log('ses', req.session);
    next()
}

let getGeoCode = async(adress) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': 'acb9a3c9bfmsha48edd8b6c5047ap1075cdjsn5629b61b4d95'
        }
    };

    let api_url = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${adress}&language=en`
    let response = await fetch(api_url, options)
    return await response.json()


}
app.listen(3000, () => { console.log("server is running.."); })
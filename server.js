"use strict"
//npm start = lancer le server
//dependences 

const express = require("express")
const bcrypt = require('bcryptjs')
const cookieSession = require('cookie-session')
const fetch = require('node-fetch')
const model = require('./model')
let app = express()

let restaurant_data = {}
    // parse form arguments in POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//creation et configuration du cookie de session
app.use(cookieSession({
    secret: 'azerty',
    keys: ['username', 'id']

}))

app.use(authenticatedView)

//app.engine('html', mustache());
app.set('view engine', 'ejs');
//app.set('views', './views');



app.use(express.static('static'))

app.get("/", (req, res) => {
    res.render('index', { user: res.locals.user, authenticated: res.locals.authenticated })
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/newRestaurant', is_authenticated, (req, res) => {
    res.render('newRestaurant')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/restaurant', (req, res) => {
    res.render('restaurant', { data: restaurant_data })

})

app.get('/search', is_authenticated, (req, res) => {
    let user_adress = req.query.adress
    let resto = model.random_restaurant()

    if (user_adress != '' && user_adress != undefined) {
        (async() => {


            //Retourne les données de l'adresse de l'utilisateur et celle du restaurant 

            let [user_data, resto_data] = await Promise.all([
                getGeoCode(user_adress),
                getGeoCode(resto.adress)
            ]);


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


            restaurant_data = {
                name: resto.name,
                adress: resto.adress,
                type: resto.type,
                budget: resto.budget,
                duration: secondsToHoursAndMinutes(distance.durations[0][0]),
                distance: mettreToKiloMetre(distance.distances[0][0]),
                comments: displayComments(resto.id)
            }


            //console.log(restaurant_data.comments);
            res.redirect('/restaurant')

        })()



    } else {
        console.log("error");
        res.redirect('/')
    }


})

app.get('/logout', (req, res) => {

    req.session = null
    res.redirect('/')

})



//POST routes

app.post('/login', (req, res) => {
    let id = model.login(req.body.username, req.body.password)
    if (id !== -1) {
        req.session.username = req.body.username
        req.session.id = id
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})


app.post('/newRestaurant', (req, res) => {
    let restaurant_adress = req.body.adress + ',' + req.body.code + ',' + req.body.ville
    let restaurant_result = model.newRestaurant(req.body.name, restaurant_adress, req.body.type, req.body.budget)

    if (restaurant_result == -1) {
        res.render("newRestaurant")
    } else {
        res.redirect('/')
    }
})


app.post('/signin', (req, res) => {
    let password = passwwordCrypt(req.body.password)
    let signin_result = model.sign_in(req.body.username, req.body.mail, password)
    if (signin_result == -1) {
        res.render("signin", { data: "Cet utilisateur existe deja" })
    } else {
        req.session.id = signin_result
        req.session.username = req.body.username
        res.redirect('/')
    }


})

app.post('/comment', (req, res) => {
    let resto_id = model.get_restaurant(restaurant_data.name)
    let liked = req.body.like === 'on' ? 1 : 0
    model.comment(req.body.comment, liked, resto_id.id, req.session.id)
    //console.log(req.body.comment);
    restaurant_data.comments = displayComments(resto_id.id)
    res.render('restaurant', { data: restaurant_data })

})



//middlewares 
function is_authenticated(req, res, next) {
    if (req.session.id == undefined || req.session.id == null) {
        res.writeHead(401)
        res.end('Accès non autorisé')
        return
    }
    next()
}

function authenticatedView(req, res, next) {
    res.locals = {
        authenticated: false,
        name: ''
    }

    if (req.session.id != undefined && req.session.id != null) {
        res.locals.authenticated = true
        res.locals.name = req.session.username
    }
    //console.log('loc', res.locals);
    //console.log('ses', req.session);
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
    return fetch(api_url, options).then(response => response.json())

}

let displayComments = (id) => {
    let req = model.get_comment(id)
    let comments = []

    for (let i = 0; i < req.length; i++) {
        comments.push({
            comment_content: req[i].comment,
            like: req[i].like
        })

    }

    //console.log("commetns", comments);

    return comments

}

let passwwordCrypt = (password) => {
    try {
        let salt = bcrypt.genSaltSync()
        let hash = bcrypt.hashSync(password, salt)
        return hash
    } catch (error) {
        console.log(error);
    }

}

const secondsToHoursAndMinutes = n => ({
    hours: Math.floor(n / 3600),
    minutes: Math.floor((n % 3600)/60)
  });

const mettreToKiloMetre = d => ({
    km : Math.floor(d/1000),
    m: d%1000
})

app.listen(3000, () => { console.log("server is running.."); })
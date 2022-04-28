const Sqlite = require('better-sqlite3')

let db = new Sqlite('db.sqlite')



exports.return_restaurant = () => {
    let data = db.prepare("SELECT adress FROM restaurants").all()
    let random_index = Math.floor(Math.random() * data.length)
    console.log(data.length, " ", random_index, data[random_index]);
    return data[random_index]
}


// Connection method using username & password
exports.login = (username, password) => {
    let req = db.prepare('SELECT id FROM users WHERE username = ? AND password = ? ').get(username, password)
    if (req == undefined) {
        return -1
    } else {
        return req.id
    }
}

//create a new user 
exports.sign_in = (username, mail, password) => {
    let req = db.prepare('SELECT id FROM users WHERE username = ? AND password = ? ').get(username, password)
    if (req == undefined) {
        db.prepare(`INSERT INTO users (username, mail, password) VALUES (?,?,?)`).run(username, mail, password)
        return db.prepare('SELECT id FROM users WHERE username = ? AND password = ? ').get(username, password).id
    } else return -1

}

exports.newRestaurant = (name, adress, type, budget) => {
    let req = db.prepare(`SELECT id FROM restaurants WHERE name = $name AND adress LIKE  '% $adress %' `).get({ name: name, adress: adress })
    if (req == undefined) {
        db.prepare(`INSERT INTO restaurants (name, adress, type, budget) VALUES (?,?,?,?)`).run(name, adress, type, budget)
        return 1
    } else return -1
}
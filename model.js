const Sqlite = require('better-sqlite3')
const bcrypt = require('bcryptjs')
let db = new Sqlite('db.sqlite')



exports.return_restaurant = () => {
    let data = db.prepare("SELECT * FROM restaurants").all()
    let random_index = Math.floor(Math.random() * data.length)
    return data[random_index]
}



// Connection method using username & password
exports.login = (username, password) => {
    let db_password = db.prepare('SELECT password FROM users WHERE username = ?').get(username)
    if (db_password !== undefined && bcrypt.compareSync(password, db_password.password)) {
        return db.prepare('SELECT id FROM users WHERE username = ? AND password = ? ').get(username, db_password.password).id
    } else {
        return -1
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

//add a new restaurant
exports.newRestaurant = (name, adress, type, budget) => {
    let req = db.prepare(`SELECT id FROM restaurants WHERE name = $name AND adress LIKE  '% $adress %' `).get({ name: name, adress: adress })
    if (req == undefined) {
        db.prepare(`INSERT INTO restaurants (name, adress, type, budget) VALUES (?,?,?,?)`).run(name, adress, type, budget)
        return 1
    } else return -1
}
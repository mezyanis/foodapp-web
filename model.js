const Sqlite = require('better-sqlite3')

let db = new Sqlite('db.sqlite')



exports.return_restaurant = () => {
    let data = db.prepare("SELECT adress FROM restaurants").all()
    let random_index = Math.floor(Math.random() * data.length)
    console.log(data.length, " ", random_index, data[random_index]);
    return data[random_index]
}


// Connection method using username & password
exports.login = (name, password) => {
    let req = db.prepare('SELECT id FROM users WHERE name = ? AND password = ? ').get(name, password)
    if (req == undefined) {
        return -1
    } else {
        return req.id
    }
}

//create a new user 
exports.new_user = (name, password) => {
    db.prepare(`INSERT INTO users (name, password) VALUES (?,?)`).run(name, password)
    return db.prepare('SELECT id FROM users WHERE name = ? AND password = ? ').get(name, password).id
}
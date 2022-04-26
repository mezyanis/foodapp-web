const Sqlite = require('better-sqlite3')

let db = new Sqlite('db.sqlite')



exports.return_restaurant = () => {
    let data = db.prepare("SELECT adress FROM restaurants").all()
    let random_index = Math.floor(Math.random() * data.length)
    console.log(data.length, " ", random_index, data[random_index]);
    return data[random_index]
}
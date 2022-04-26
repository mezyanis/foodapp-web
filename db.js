const Sqlite = require('better-sqlite3')

let db = new Sqlite('db.sqlite')

/*function create_db() {
    db.prepare('DROP TABLE IF EXISTS restaurants').run();
    db.prepare('DROP TABLE IF EXISTS opinions').run();
    db.prepare('DROP TABLE IF EXISTS users').run();

    db.prepare('CREATE TABLE restaurants( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, adress TEXT NOT NULL, type TEXT NOT NULL, budget TEXT NOT NULL)').run()
    db.prepare('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)').run()


    db.prepare('CREATE TABLE opinions (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT, grade TEXT, restaurant_id INTEGER, user_id INTEGER,FOREIGN KEY (restaurant_id) REFERENCES restaurants(id), FOREIGN KEY (user_id) REFERENCES users(id) )').run()

    let addData = () => {
        db.prepare(`INSERT INTO users (username, password) VALUES ('yanis', 'kawkaw2003')`).run()
        db.prepare(`INSERT INTO restaurants (name, adress, type, budget) VALUES ('otacos', 'marseille pardo', 'fast-food', '€' )`).run()
    }
    addData()
}*/

//create_db()
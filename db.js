const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE Users (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE Channels (
      id INTEGER PRIMARY KEY,
      name TEXT,
      owner_id INTEGER,
      FOREIGN KEY(owner_id) REFERENCES Users(id)
    )
  `);

  db.run(`
    CREATE TABLE Messages (
      id INTEGER PRIMARY KEY,
      content TEXT,
      channel_id INTEGER,
      user_id INTEGER,
      FOREIGN KEY(channel_id) REFERENCES Channels(id),
      FOREIGN KEY(user_id) REFERENCES Users(id)
    )
  `);

  db.run(`
    CREATE TABLE Subscriptions (
      user_id INTEGER,
      channel_id INTEGER,
      PRIMARY KEY(user_id, channel_id),
      FOREIGN KEY(user_id) REFERENCES Users(id),
      FOREIGN KEY(channel_id) REFERENCES Channels(id)
    )
  `);
});

module.exports = db;

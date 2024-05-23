const express = require('express');
const db = require('./db');

const router = express.Router();

router.post('/users', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO Users (name) VALUES (?)', [name], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(`Användare skapad med ID: ${this.lastID}`);
  });
});
router.get('/users', (req, res) => {
    db.all('SELECT * FROM Users', (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });

router.post('/channels', (req, res) => {
    const { name, ownerId } = req.body;
  
   
    db.get('SELECT * FROM Users WHERE id = ?', [ownerId], (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (!row) {
        return res.status(400).send('Användaren med den angivna ownerId existerar inte');
      }
  
   
      db.run('INSERT INTO Channels (name, owner_id) VALUES (?, ?)', [name, ownerId], function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.send(`Kanal skapad med ID: ${this.lastID}`);
      });
    });
  });
  router.get('/channels', (req, res) => {
    db.all('SELECT * FROM Channels', (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });

router.post('/subscriptions', (req, res) => {
  const { userId, channelId } = req.body;
  db.run('INSERT INTO Subscriptions (user_id, channel_id) VALUES (?, ?)', [userId, channelId], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send('Prenumeration skapad');
  });
});

router.get('/subscriptions', (req, res) => {
    db.all('SELECT * FROM Subscriptions', (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });
  
  router.get('/subscriptions/user/:userId', (req, res) => {
    const { userId } = req.params;
    db.all('SELECT * FROM Subscriptions WHERE user_id = ?', [userId], (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });

router.post('/messages', (req, res) => {
    const { content, userId, channelId } = req.body;
  
   
    db.get('SELECT * FROM Subscriptions WHERE user_id = ? AND channel_id = ?', [userId, channelId], (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (!row) {
        return res.status(403).send('Användaren har inte prenumeration för denna kanal');
      }
  
      
      db.run('INSERT INTO Messages (content, channel_id, user_id) VALUES (?, ?, ?)', [content, channelId, userId], function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.send(`Meddelande skickat till kanal med ID: ${channelId}`);
      });
    });
  });
  router.get('/messages', (req, res) => {
    db.all('SELECT * FROM Messages', (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });

  router.get('/messages/channel/:channelId', (req, res) => {
    const { channelId } = req.params;
    db.all('SELECT * FROM Messages WHERE channel_id = ?', [channelId], (err, rows) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(rows);
    });
  });
module.exports = router;

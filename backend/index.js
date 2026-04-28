require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Review = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET tutte le review
app.get('/reviews', async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

// POST nuova review
app.post('/reviews', async (req, res) => {
  const newReview = new Review(req.body);
  await newReview.save();
  res.json(newReview);
});

const path = require('path');
const PORT = process.env.PORT || 3000;

// serve i file statici (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => console.log(`Server su http://localhost:${PORT}`));
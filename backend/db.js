const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true,  // solo per sviluppo locale
});

const ReviewSchema = new mongoose.Schema({
  movie: String,
  username: { type: String, default: 'Anonimo' },
  text: String,
  rating: Number,
  date: String,
});

module.exports = mongoose.model('Review', ReviewSchema);
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// setting up EJS
app.set('view engine', 'ejs');
// default views folder for ejs. no need ot render views folder in res.render
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({ title: 'My Backyard', description: 'Cheap camping!' });
  await camp.save();
  res.send(camp)
})




app.listen(3000, () => {
  console.log('Serving on port 3000')
})
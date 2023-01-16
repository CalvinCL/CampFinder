const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

// setting up EJS
app.set('view engine', 'ejs');
// default views folder for ejs. no need ot render views folder in res.render
app.set('views', path.join(__dirname, 'views'));

// parse body for submitted forms
app.use(express.urlencoded({ extended: true }));
// 
app.use(methodOverride('_method'));

// home page?
app.get('/', (req, res) => {
  res.render('home')
})

// general camps
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

// Create new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

// route for individual camps
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
})
// updates route for current campground
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000, () => {
  console.log('Serving on port 3000')
})
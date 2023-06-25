const mongoose = require("mongoose");
const Campground = require("../models/champground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          url: "https://res.cloudinary.com/dl98qmbxw/image/upload/v1687666032/YelpCamp/lwicj911dfmxfz1mldtv.png",
          filename: "YelpCamp/lwicj911dfmxfz1mldtv",
        },
        {
          url: "https://res.cloudinary.com/dl98qmbxw/image/upload/v1687666032/YelpCamp/kzo6w15jfz2facbmcj7m.png",
          filename: "YelpCamp/kzo6w15jfz2facbmcj7m",
        },
      ],
      description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium, molestiae labore, saepe commodi nisi expedita voluptatem sint minima ad libero iure voluptates veritatis, repellat tempore odio alias deserunt vitae. Impedit! Sit debitis, unde ipsam voluptas laboriosam nisi expedita iste ut magnam et. Molestiae accusantium itaque voluptates deserunt minima blanditiis molestias debitis vero odit. Magni alias provident optio explicabo commodi soluta!`,
      price,
      author: "6490950577df15b5caeeaf43",
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});

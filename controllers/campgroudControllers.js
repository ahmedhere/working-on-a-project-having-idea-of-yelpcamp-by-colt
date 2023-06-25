const Campground = require("../models/champground");
const AppError = require("../AppError");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (e) {
    next(e);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.byId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
      return next(
        new AppError(
          401,
          "Invalid ID. The id you entered doesn't match the legacy"
        )
      );
    }
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    // console.log(campground);
    if (!campground) {
      req.flash("error", "cannot find the campground");
      return res.redirect("/campgrounds");
      return next(new AppError(404, "not found"));
    }

    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.NewCampground = async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    campground.author = req.user._id;
    await campground.save();
    if (!campground.id) {
      return next(new AppError(404, "Not Found"));
    }
    req.flash("success", "Successfully made a new campground");
    res.redirect(`campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
      return next(
        new AppError(
          401,
          "Invalid ID. The id you entered doesn't match the legacy"
        )
      );
    }
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "cannot find the campground");
      return res.redirect("/campgrounds");
      return next(new AppError(404, "not found"));
    }
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.UpdateEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
      return next(
        new AppError(
          401,
          "Invalid ID. The id you entered doesn't match the legacy"
        )
      );
    }
    const campground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { new: true }
    );
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.image.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { image: { filename: { $in: req.body.deleteImages } } },
      });
    }
    if (!campground) {
      return next(new AppError(404, "not found"));
    }
    req.flash("success", "Successfully updated");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.length < 24 || id.length > 24) {
      return next(
        new AppError(
          401,
          "Invalid ID. The id you entered doesn't match the legacy"
        )
      );
    }

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a campground");
    res.redirect("/campgrounds");
  } catch (e) {
    next(e);
  }
};

const Joi = require("joi");
const express = require('express');
const router = express.Router();

////////////////////////////////////////
// Internal data -- sample /////////////
////////////////////////////////////////
videos = [
  {
    id: 1,
    genre: "Fantasy"
  },
  {
    id: 2,
    genre: "Science Fiction"
  }
];

////////////////////////////////////////
// POST method(s) //////////////////////
////////////////////////////////////////
router.post("/", (req, res) => {
  const { error } = validateVideo(req.body, false);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const video = {
    id: videos.length + 1,
    genre: req.body.genre
  };
  videos.push(video);
  res.send(video);
});

////////////////////////////////////////
// GET method(s) ///////////////////////
////////////////////////////////////////
router.get("/", (req, res) => {
  res.send(videos);
});

router.get("/:id", (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).send("The video with given ID was not found");
  }
  res.send(video);
});

////////////////////////////////////////
// PUT method(s) ///////////////////////
////////////////////////////////////////
router.put("/:id", (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).send("The video with given ID was not found");
  }

  // Use destructuring to only retrieve error from result
  const { error } = validateVideo(req.body, true);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  video.genre = req.body.genre;
  res.send(video);
});

////////////////////////////////////////
// DELETE method(s) ////////////////////
////////////////////////////////////////
router.delete("/:id", (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).send("The video with given ID was not found");
  }

  const index = videos.indexOf(video);
  videos.splice(index, 1);
  res.send(video);
});

////////////////////////////////////////
// Validate with Joi object ////////////
////////////////////////////////////////
const validateVideo = (video, needId) => {
  const schema = needId
    ? Joi.object(
      {
        id: Joi.number()
          .integer()
          .required(),
        genre: Joi.string()
          .min(1)
          .required()
      }
    )
    : Joi.object(
      {
        genre: Joi.string()
          .min(1)
          .required()
      }
    );
  // Note that Joi.validate(request, schema) as of Joi 16.x
  // must be changed to schema.validate(request) to avoid
  // an error message:
  // TypeError: Joi.validate is not a function
  return schema.validate(video);
};

module.exports = router;

////////////////////////////////////////
// Module requirements /////////////////
////////////////////////////////////////
const Joi = require("joi");
const express = require("express");

////////////////////////////////////////
// Instantiate and configure Express ///
////////////////////////////////////////
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
// GET method(s) ///////////////////////
////////////////////////////////////////
app.get("/api/vidly/genres", (req, res) => {
  res.send(videos);
});

app.get("/api/vidly/genres/:id", (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).send("The video with given ID was not found");
  }
  res.send(video);
});

////////////////////////////////////////
// POST method(s) //////////////////////
////////////////////////////////////////
app.post("/api/vidly/genres", (req, res) => {
  console.log("∞° req=\n" + JSON.stringify(req));
  console.log("∞° req.body=\n" + JSON.stringify(req.body));
  const { error } = validateVideo(req.body, false);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const video = {
    id: videos.length + 1,
    genre: req.body.genre
  };
  videos.push(course);
  res.send(video);
});

////////////////////////////////////////
// PUT method(s) ///////////////////////
////////////////////////////////////////
app.put("/api/vidly/genres/:id", (req, res) => {
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
app.delete("/api/vidly/genres/:id", (req, res) => {
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

////////////////////////////////////////
// Listen on configured PORT ///////////
////////////////////////////////////////
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "0c8a5d6939344269838e5f2a28acdcc5",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with api"));
};
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
  //res.tatus(404).json("no such user");
};

module.exports = {
  handleImage,
  handleApiCall,
};

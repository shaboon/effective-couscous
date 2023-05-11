const router = require("express").Router();

const {
  getAllThoughts,
  getOneThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtsController");

router.route("/").get(getAllThoughts).post(createThought);

router.route("/:id").get(getOneThought).put(updateThought).delete(deleteThought);

router.route("/:thoughtId/reaction/").post(addReaction);

router.route("/:thoughtId/reaction/:reactionId").delete(removeReaction);

module.exports = router;

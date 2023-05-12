const { ObjectId } = require("mongodb");
const { User, Thought } = require("../models");

module.exports = {
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select("-__v");
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async getOneThought(req, res) {
    try {
      const oneThought = await Thought.findOne({ _id: req.params.id });

      if (!oneThought) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(oneThought);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body).then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body._id },
          { $push: { thoughts: _id } },
          { new: true }
        );
      });

      await User.findOneAndUpdate(
        { _id: req.body.userid },
        { $addToSet: { thoughts: newThought._id } }
      );

      return res.json(newThought);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      await Thought.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
      }).then((data) => {
        if (!data) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        return res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const scorchThought = await Thought.findOneAndDelete(
        { _id: req.params.id },
        { runValidators: true, new: true }
      );

      if (!scorchThought) {
        return res
          .status(404)
          .json({ message: "No thought found with this id!" });
      }
      res.json(scorchThought);
      return User.findOneAndUpdate(
        { _id: scorchThought._id },
        { $pull: { thoughts: scorchThought._id } },
        { new: true }
      );
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.params.reactionText } },
        { new: true }
      );
      return res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      );
    } catch {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },
};

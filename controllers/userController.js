const { ObjectId } = require("mongodb");
const { User } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-__v");

      const userObj = {
        users,
      };

      res.json(userObj);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async getOneUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).select("-__v");

      if (!user) {
        return res.status(404).json({ message: "No user found with this id!" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { runValidators: true, new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: req.params.friendId } },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      res.json(user);
    } catch {
      res.status(500).json(err);
      console.log(err);
      return res.status(500).json(err);
    }
  },
};

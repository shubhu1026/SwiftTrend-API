const errors = require("restify-errors");
const User = require("../../models/UserModel");

function getAllUsers(req, res, next) {
  console.log("GET /users query parameters =>", req.query);
  // Find every entity in the database
  User.find({})
    .then((users) => {
      // Return all of the Users in the system
      res.send(users);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
}

function getUserById(req, res, next) {
  const userId = req.params.id;

  // Find the user by ID
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
        return next();
      } else {
        throw new errors.NotFoundError("User not found");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error fetching user by ID"));
    });
}

function updateUser(req, res, next) {
  const userId = req.params.id;
  const updateData = req.body;

  // Update the user by ID
  User.findByIdAndUpdate(userId, updateData, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.send(updatedUser);
        return next();
      } else {
        throw new errors.NotFoundError("User not found for updating");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error updating user"));
    });
}

function deleteUser(req, res, next) {
  const userId = req.params.id;

  // Delete the user by ID
  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (deletedUser) {
        res.send(deletedUser);
        return next();
      } else {
        throw new errors.NotFoundError("User not found for deletion");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error deleting user"));
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

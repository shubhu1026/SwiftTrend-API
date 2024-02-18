const errors = require("restify-errors");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function getAllUsers(req, res, next) {
  console.log("GET /patients query parameters =>", req.query);
  // Find every entity in db
  UserModel.find({})
    .then((Users) => {
      // Return all of the Patients in the system
      res.send(Users);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
}

function signup(req, res, next) {
  const {
    username,
    fullName,
    email,
    password,
    gender,
    dateOfBirth,
    contactNumber,
    address,
  } = req.body;

  // Check if the username or email already exists
  UserModel.findOne({ $or: [{ username }, { email }] })
    .then((existingUser) => {
      if (existingUser) {
        return next(
          new errors.BadRequestError("Username or email already exists")
        );
      }

      // Hash the password
      return bcrypt.hash(password, saltRounds);
    })
    .then((hashedPassword) => {
      // Create a new user with the hashed password
      const newUser = new UserModel({
        username,
        fullName,
        email,
        password: hashedPassword,
        gender,
        dateOfBirth,
        contactNumber,
        address,
      });

      // Save the user to the database
      return newUser.save();
    })
    .then(() => {
      res.send(201, { success: "User registered successfully" });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error registering user"));
    });
}

function login(req, res, next) {
  const { identifier, password } = req.body;

  // Find the user by username or email
  UserModel.findOne({ $or: [{ username: identifier }, { email: identifier }] })
    .then((user) => {
      // Check if the user exists and the password is correct
      if (user) {
        return bcrypt.compare(password, user.password).then((passwordMatch) => {
          if (passwordMatch) {
            // Send user ID along with success message
            res.send({
              success: "User logged in successfully",
              userId: user._id,
            });
            return next();
          } else {
            throw new errors.UnauthorizedError("Invalid password");
          }
        });
      } else {
        throw new errors.UnauthorizedError("Invalid username or email");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error during login"));
    });
}

function getUserById(req, res, next) {
  const userId = req.params.id;

  // Find the user by ID
  UserModel.findById(userId)
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
  UserModel.findByIdAndUpdate(userId, updateData, { new: true })
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

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserById,
  updateUser,
};

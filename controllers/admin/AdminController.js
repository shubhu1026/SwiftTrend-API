const errors = require("restify-errors");
const AdminModel = require("../../models/AdminModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

function getAllAdmins(req, res, next) {
  console.log("GET /admins query parameters =>", req.query);
  // Find every entity in db
  AdminModel.find({})
    .then((admins) => {
      // Return all of the Admins in the system
      res.send(admins);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
}

function createAdmin(req, res, next) {
  const { username, password, email } = req.body;

  // Check if the username or email already exists
  AdminModel.findOne({ $or: [{ username }, { email }] })
    .then((existingAdmin) => {
      if (existingAdmin) {
        return next(
          new errors.BadRequestError("Username or email already exists")
        );
      }

      // Hash the password
      return bcrypt.hash(password, saltRounds);
    })
    .then((hashedPassword) => {
      // Create a new admin with the hashed password
      const newAdmin = new AdminModel({
        username,
        password: hashedPassword,
        email,
      });

      // Save the admin to the database
      return newAdmin.save();
    })
    .then(() => {
      res.send(201, { success: "Admin created successfully" });
      return next();
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error creating admin"));
    });
}

function getAdminById(req, res, next) {
  const adminId = req.params.id;

  // Find the admin by ID
  AdminModel.findById(adminId)
    .then((admin) => {
      if (admin) {
        res.send(admin);
        return next();
      } else {
        throw new errors.NotFoundError("Admin not found");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error fetching admin by ID"));
    });
}

function updateAdmin(req, res, next) {
  const adminId = req.params.id;
  const updateData = req.body;

  // Check if there is a new password to update
  if (updateData.password) {
    // Hash the new password
    bcrypt
      .hash(updateData.password, saltRounds)
      .then((hashedPassword) => {
        // Update the admin with the hashed password
        updateData.password = hashedPassword;

        // Perform the update
        performUpdate(adminId, updateData, res, next);
      })
      .catch((error) => {
        console.error(error);
        return next(
          new errors.InternalServerError("Error hashing the new password")
        );
      });
  } else {
    // If there's no new password, perform the update directly
    performUpdate(adminId, updateData, res, next);
  }
}

function performUpdate(adminId, updateData, res, next) {
  // Update the admin by ID
  AdminModel.findByIdAndUpdate(adminId, updateData, { new: true })
    .then((updatedAdmin) => {
      if (updatedAdmin) {
        res.send(updatedAdmin);
        return next();
      } else {
        throw new errors.NotFoundError("Admin not found for updating");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error updating admin"));
    });
}

function deleteAdmin(req, res, next) {
  const adminId = req.params.id;

  // Delete the admin by ID
  AdminModel.findByIdAndDelete(adminId)
    .then((deletedAdmin) => {
      if (deletedAdmin) {
        res.send(deletedAdmin);
        return next();
      } else {
        throw new errors.NotFoundError("Admin not found for deletion");
      }
    })
    .catch((error) => {
      console.error(error);
      return next(new errors.InternalServerError("Error deleting admin"));
    });
}

module.exports = {
  getAllAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};

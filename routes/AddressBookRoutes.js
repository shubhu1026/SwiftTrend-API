const restify = require("restify");
const addressBookController = require("../controllers/AddressBookController");

function configureAddressBookRoutes(server) {
  server.get("/:userId/addresses", addressBookController.getAllAddresses);
  server.post("/:userId/addresses", addressBookController.addAddress);
  server.put(
    "/:userId/addresses/:addressId",
    addressBookController.updateAddress
  );
  server.del(
    "/:userId/addresses/:addressId",
    addressBookController.deleteAddress
  );
}

module.exports = configureAddressBookRoutes;

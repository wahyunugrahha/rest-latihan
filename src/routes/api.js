import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import contactController from "../controller/contact-controller.js";
import addressController from "../controller/address-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//User Api
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

//Contact Api
userRouter.post("/api/contacts", contactController.create);
userRouter.get("/api/contacts/:contact_id", contactController.get);
userRouter.put("/api/contacts/:contact_id", contactController.update);
userRouter.delete("/api/contacts/:contact_id", contactController.remove);
userRouter.get("/api/contacts/", contactController.search);
export { userRouter };

//Address API
userRouter.post(
  "/api/contacts/:contact_id/addresses",
  addressController.create
);
userRouter.get(
  "/api/contacts/:contact_id/addresses/:addressId",
  addressController.get
);
userRouter.put(
  "/api/contacts/:contact_id/addresses/:addressId",
  addressController.update
);
userRouter.delete(
  "/api/contacts/:contact_id/addresses/:addressId",
  addressController.remove
);


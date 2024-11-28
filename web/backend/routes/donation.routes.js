import { Router } from "express";
import { createOrder, verifyPayment, getDonations } from "../controllers/donation.controller.js";

const routes = Router();

//prefix - /v1/donation example /v1/donation/get-donations

routes.route('/create-order').post(createOrder)
routes.route('/verify-payment').post(verifyPayment)
routes.route('/get-donations').get(getDonations)

export default routes
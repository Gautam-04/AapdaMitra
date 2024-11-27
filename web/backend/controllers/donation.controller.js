import { Donation } from "../models/donations.models.js";
import {createHmac } from 'node:crypto'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req,res) => {
const { amount, userId } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay works in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const verifyPayment  = async(req,res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body;

  try {
    const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');


    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid Signature' });
    }

    const donationCount = await Donation.countDocuments();
    const donation = new Donation({
      serialNumber: donationCount + 1,
      paymentId: razorpay_payment_id,
      userId,
      amount,
    });

    //implement web3 logic
    await donation.save();

    res.json({ success: true, donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const getDonations = async() => {
    try {
    const donations = await Donation.find();
    res.json({ success: true, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export {createOrder,verifyPayment,getDonations}
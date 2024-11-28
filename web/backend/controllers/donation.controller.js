import { Donation } from "../models/donations.models.js";
import {createHmac } from 'node:crypto'
import Razorpay from 'razorpay'
import { Web3 } from "web3";

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


const Providerurl = 'https://polygon-rpc.com'
const web3 = new Web3(new Web3.providers.HttpProvider(Providerurl))
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
    const amountInMatic = 0.01;
    const amountInWei = web3.utils.toWei(amountInMatic.toString(), 'ether');

    const rootAccount = web3.eth.accounts.privateKeyToAccount(process.env.BLOCKCHAIN_ACCOUNT);
    web3.eth.accounts.wallet.add(rootAccount);
    web3.eth.defaultAccount = rootAccount.address;

    const recipientAccountAddress = process.env.RECIPIENT_ACCOUNT_ADDRESS;

    const tx = {
      from: rootAccount.address,
      to: recipientAccountAddress,
      value: amountInWei,
      gas: 21000,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.BLOCKCHAIN_ACCOUNT);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    const dataHash = web3.utils.sha3(JSON.stringify(donation));
    donation.blockchain = {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      dataHash,
    };



    await donation.save();

    res.json({ success: true, donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const getDonations = async(req,res) => {
    try {
    const donations = await Donation.find();
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export {createOrder,verifyPayment,getDonations}
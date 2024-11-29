import { Donation,Fundraiser } from "../models/donations.models.js";
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

class BlockchainService {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    }

    async signTransaction(fromAddress, toAddress, data) {
        try {
            const gasPrice = await this.web3.eth.getGasPrice();
            const gasLimit = await this.web3.eth.estimateGas({
                from: fromAddress,
                to: toAddress,
                value: '0x0',
                data: data
            });

            const nonce = await this.web3.eth.getTransactionCount(fromAddress);

            const txObject = {
                nonce: this.web3.utils.toHex(nonce),
                to: toAddress,
                value: '0x0',
                gasLimit: this.web3.utils.toHex(gasLimit),
                gasPrice: this.web3.utils.toHex(gasPrice),
                data: data
            };

            const dataHash = await this.web3.utils.sha3(JSON.stringify(data));

            const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
            const signedTx = await this.web3.eth.accounts.signTransaction(txObject, privateKey);
            const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(receipt)

            return {
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockHash,
                dataHash: dataHash
            };
        } catch (error) {
            throw new Error(`Blockchain transaction failed: ${error.message}`);
        }
    }

    async getAccounts() {
        return await this.web3.eth.getAccounts();
    }
}

const verifyPayment  = async(req,res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount, fundraiserId} = req.body;

  try {
    const generated_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid Signature' });
    }
    console.log(generated_signature,razorpay_signature)

        const blockchainService = new BlockchainService();
        const accounts = await blockchainService.getAccounts();
        const fromAddress = accounts[0];

        const donationCount = await Donation.countDocuments();
        const serialNumber = donationCount + 1;
        const donationData = blockchainService.web3.utils.asciiToHex(JSON.stringify({
            serialNumber,
            paymentId: razorpay_payment_id,
            userId,
            amount
        }));


        const blockchainReceipt = await blockchainService.signTransaction(
            fromAddress,
            process.env.BLOCKCHAIN_ACCOUNT,
            donationData
        );

        const donation = new Donation({
            serialNumber,
            paymentId: razorpay_payment_id,
            userId,
            amount,
            blockchain: {
                transactionHash: blockchainReceipt.transactionHash,
                blockNumber: blockchainReceipt.blockNumber,
                dataHash: blockchainReceipt.dataHash,
            }
        });

        if (fundraiserId) {
      const fundraiser = await Fundraiser.findById(fundraiserId);
      if (!fundraiser) {
        return res.status(404).json({ success: false, message: "Fundraiser not found" });
      }
      fundraiser.donations.push(donation._id);
      await fundraiser.save();
    }

// donation.blockchain = {
//   transactionHash: receipt.transactionHash,
//   blockNumber: receipt.blockNumber,
//   dataHash,
// };

    await donation.save();

    res.json({ success: true, donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

const getDonations = async(req,res) => {
    const { fundraiserId } = req.query; // Optional filter by fundraiser
  try {
    const query = fundraiserId ? { _id: fundraiserId } : {};
    const donations = await Fundraiser.find(query).populate("donations");
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

const createFundraiser = async (req, res) => {
  const { title, fullForm, description, logo } = req.body;
  try {
    const fundraiser = new Fundraiser({ title, fullForm, description, logo });
    await fundraiser.save();
    res.status(201).json({ success: true, fundraiser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteFundraiser = async (req, res) => {
  const { id } = req.params;
  try {
    const fundraiser = await Fundraiser.findByIdAndDelete(id);
    if (!fundraiser) {
      return res.status(404).json({ success: false, message: "Fundraiser not found" });
    }
    // Optionally delete associated donations
    await Donation.deleteMany({ _id: { $in: fundraiser.donations } });
    res.status(200).json({ success: true, message: "Fundraiser deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getFundraiser = async(req,res) => {
  try {
    const fundraiser = await Fundraiser.find();
    res.status(200).json({ success: true, fundraiser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

export {createOrder,verifyPayment,getDonations,createFundraiser,deleteFundraiser,getFundraiser}
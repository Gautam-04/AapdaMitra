import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema({
  serialNumber: Number,
  paymentId: String,
  userId: String,
  amount: Number,
  paymentDate: { type: Date, default: Date.now },
  blockchain: {
    transactionHash: String,
    blockNumber: Number,
    dataHash: String,
  },
},{
    timestamps: true
})

export const Donation = mongoose.model('Donation',donationSchema)


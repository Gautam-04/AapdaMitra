import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { Router } from "express";

//models
const Citizen = mongoose.model('Citizen',mongoose.Schema({
    'name': {type: String, required: true},
    'email': {type: String, required: true, unique: true}
},{timestamps: true}))

const Issue = mongoose.model('Issue', mongoose.Schema({
    'photo': {type: String, default: ''},
    'title' : {type: String, trim: true, default: 'Untitled Issue'},
    'description': {type: String, trim: true, default: 'No description provided.'},
    'emergencyType': {
        type: String, 
        enum: ['Natural Disaster', 'Medical', 'Fire', 'Infrastructure', 'Other'], 
        default: 'Other'
    }
},{
    timeStamps: true
}))

const Sos = mongoose.model('Sos',mongoose.Schema({
    'name': {type: String, required: true, default: ''},
    'email': {type: String, required: true, default: ''},
    'location': {type: String, trim: true, required: true, default: ''},
    'emergencyType': {
        type: String, 
        enum: ['Natural Disaster', 'Medical', 'Fire', 'Infrastructure', 'Other'],
        default: 'Other'
    }
},{
    timestamps: true
}))


//setup
function generateToken(id){
    return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.MOBILE_REFRESH_TOKEN_EXPIRY})
}

const transporter = nodemailer.createTransport({
    host: 'smtp.rediffmail.com', 
    port: 465, // Use 465 for SSL, 587 for TLS
    secure: true, // Set to true for SSL (port 465), false for TLS (port 587)
    auth: {
        user: process.env.RediffMail_id, // Replace with your Rediffmail email
        pass: process.env.RediffMail_pass, // Replace with your Rediffmail password
  },
});

const otpStore = new Map();


//middlewares


//controllers


//auth controllers
const citizenRegister = async(req,res) =>{
    const {email} = req.body;

    try {
        const existingUser = await Citizen.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already registered with this mobile number" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        otpStore.set(email, otp); 

        await transporter.sendMail({
            from: process.env.RediffMail_id,
            to: email,
            subject: 'OTP for Registration',
            text: `Your OTP is: ${otp}`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP", error });
    }
}

const verifyRegisteredUser = async(req,res) => {
    const { email, otp, name } = req.body;
try {
        if (!email || !name || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (otpStore.has(email) && otpStore.get(email) === otp) {
            const user = await Citizen.create({ email, name });

            const createdUser = await Citizen.findById(user._id);

            if (!createdUser) {
                return res.status(400).json({ message: "User creation failed" });
            }

            const accessToken = generateToken(createdUser._id);

            otpStore.delete(email);

            return res.status(200).json({ message: "User registered successfully", createdUser, accessToken });
        } else {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "An error occurred during OTP verification", error });
    }
}

const citizenLogin= async(req,res) => {
const {email} = req.body;

    try {
        if(!email){
            return res.status(400).json({message: "Email Field are empty"})
        }
        
        const existedUser = await Citizen.findOne({email})
        
        if(!existedUser){
            return res.status(400).json({message: "User does not exist by this username/email"})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        otpStore.set(email, otp); 

        await transporter.sendMail({
            from: process.env.RediffMail_id,
            to: email,
            subject: 'OTP for Registration',
            text: `Your OTP is: ${otp}`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP", error });
    }

}

const verifyLoggedInUser = async (req,res) => {
    const {email,otp} = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (otpStore.has(email) && otpStore.get(email) === otp) {

            const loggedInUser = await Citizen.findOne({email});

            if (!loggedInUser) {
                return res.status(400).json({ message: "User not found" });
            }

            const accessToken = generateToken(loggedInUser._id);

            otpStore.delete(email);

            return res.status(200).json({ message: "User loggedin successfully", loggedInUser, accessToken });
        } else {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "An error occurred during OTP verification", error });
    }
}

const AddIssue = async(req,res) => {
    const {photo,title,description,emergencyType} = req.body

    const newIssue = await Issue.create({
        photo,
        title,
        description,
        emergencyType})

    if(!newIssue){
        return res.status(400).json({message: 'New Issue not raised'})
    }

    return res.status(200).json({message: 'Issue raised successfully'})
}

const getAllIssue = async(req,res) => {
    const allIssue = await Issue.find({});

    if (allIssue.length === 0) {
            return res.status(404).json({ message: 'There are no issues to retrieve' });
        }

        return res.status(200).json(allIssue);
}

const sendSos = async(req,res) => {
    const {name,email,location,emergencyType} = req.body;

    if(!name || !email){
        return res.status(400).json({message: 'Login again'})
    }

    if(!location || !emergencyType){
        return res.status(400).json({message: 'Give location permission'})
    }

    const newSos = await Sos.create({
        name,
        email,
        location,
        emergencyType})

    if(!newSos){
        return res.status(400).json({message: 'Sos not raised'})
    }

    return res.status(200).json({message: 'Sos sent'})
}

const getSos = async(req,res) => {
    const allSos = await Sos.find({});

    if (allSos.length === 0) {
            return res.status(404).json({ message: 'There are no issues to retrieve' });
        }

        return res.status(200).json(allSos);
}

const perHrSosCount = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const hourlyData = [];

        for (let hour = 0; hour < 24; hour++) {
            const startHour = new Date(startOfDay);
            startHour.setHours(hour);

            const endHour = new Date(startHour);
            endHour.setHours(hour + 1);

            const sosCount = await Sos.countDocuments({
                createdAt: {
                    $gte: startHour,
                    $lt: endHour,
                },
            });

            hourlyData.push({
                hour: `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`,
                count: sosCount,
            });
        }

        return res.status(200).json(hourlyData);
    } catch (error) {
        console.error('Error in perHrSosCount:', error);
        return res.status(500).json({ 
            message: 'Error fetching hourly SOS counts',
            error: error.message 
        });
    }
}

const perMonthSosCount = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];

        const monthNames = [
            'January', 'February', 'March', 'April', 
            'May', 'June', 'July', 'August', 
            'September', 'October', 'November', 'December'
        ];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(currentYear, month, 1);
            const endOfMonth = new Date(currentYear, month + 1, 1);

            const sosCount = await Sos.countDocuments({
                createdAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            });

            // const dailyData = [];
            // for (let day = 1; day <= new Date(currentYear, month + 1, 0).getDate(); day++) {
            //     const startOfDay = new Date(currentYear, month, day);
            //     const endOfDay = new Date(currentYear, month, day + 1);

            //     const dailyCount = await Sos.countDocuments({
            //         createdAt: {
            //             $gte: startOfDay,
            //             $lt: endOfDay
            //         }
            //     });

            //     dailyData.push({
            //         date: `${currentYear}-${month + 1}-${day}`,
            //         count: dailyCount
            //     });
            // }

            monthlyData.push({
                month: monthNames[month],
                year: currentYear,
                totalMonthlyCount: sosCount,
                // dailyCounts: dailyData
            });
        }

        return res.status(200).json(monthlyData);
    } catch (error) {
        console.error('Error in perMonthSosCount:', error);
        return res.status(500).json({ 
            message: 'Error fetching monthly SOS counts',
            error: error.message 
        });
    }
};


//raise a req controller

//routes
import {getFundraiser} from './controllers/donation.controller.js'
const routes = Router();

routes.route('/register-citizen').post(citizenRegister)
routes.route('/verify-reg-citizen').post(verifyRegisteredUser)
routes.route('/login-mobile').post(citizenLogin)
routes.route('/verify-login-citizen').post(verifyLoggedInUser)
routes.route('/get-fundraisers').get(getFundraiser)
routes.route('/add-issue').post(AddIssue)
routes.route('/send-sos').post(sendSos)


//for admin routes
routes.route('/get-all-issue').get(getAllIssue)
routes.route('/get-all-sos').get(getSos)
routes.route('/per-hr-sos').get(perHrSosCount)
routes.route('/per-month-sos').get(perMonthSosCount)


export default routes
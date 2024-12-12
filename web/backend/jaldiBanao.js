import mongoose from "mongoose";
import { Router } from "express";
import data from "./dataUtils.js";
import moment from "moment-timezone";
import axios from "axios";

const router = Router();

let count = 0;

let interval = null;

const UpdateData = async (io) => {
  if (count < data.length) {
    const currentData = data[count];
    const enhancedData = {
      ...currentData, // Spread the current data
      createdAt: moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"), // Format the date
    };
    const elasticResponse = await axios.post(
      "http://localhost:5000/search/add-post",
      {
        post_id: enhancedData.post_id || "",
        post_title: enhancedData.post_title || "",
        post_body: enhancedData.post_body || "",
        post_body_full: enhancedData.post_body_full || "",
        date: enhancedData.createdAt || "",
        likes: enhancedData.likes || 0,
        retweets: enhancedData.retweets || 0,
        post_image_url: enhancedData.post_image_url || "",
        location: enhancedData.location || "",
        url: enhancedData.url || "",
        disaster_type: enhancedData.disaster_type || "",
        source: enhancedData.source || "",
      }
    );

    io.emit("updateRealTimeData", enhancedData);
    console.log(
      `Sending data for post_id: ${enhancedData.post_id}, ${elasticResponse}`
    );
    count++;
  } else {
    console.log("All data sent.");
    clearInterval(interval);
    interval = null;
  }
};

///v1/jaldibanao/updatedata
router.route("/updatedata").post((req, res) => {
  const io = req.app.get("io");
  if (!interval) {
    count = 0;
    interval = setInterval(() => UpdateData(io), 15000);
    res.status(200).json({ message: "Real-time data updates started." });
  } else {
    res
      .status(400)
      .json({ message: "Real-time data updates are already running." });
  }
});

export default router;

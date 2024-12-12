import mongoose from "mongoose";
import { Router } from "express";
import data from "./dataUtils.js";
import moment from "moment-timezone";
import axios from "axios";

const router = Router();

let count = 0;

let interval = null;

const UpdateData = async(io) => {
  if (count < data.length) {
    const currentData = data[count];
    const enhancedData = {
      ...currentData, // Spread the current data
      createdAt: moment()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DDTHH:mm:ss"), // Format the date
    };
    const elasticResponse = await axios.post("http://localhost:5000/search/add-post", {
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
    });

     io.emit("updateRealTimeData", enhancedData); 
    console.log(`Sending data for post_id: ${enhancedData.post_id}, ${elasticResponse}`);
    count++;
  } else {
    console.log("All data sent.");
    clearInterval(interval); 
    interval = null; 
  }
};

const DataLlmCollection = mongoose.model("DataLlm",mongoose.Schema({},{
"post_id":String,
"oneLinerInfo" :String
},{timestamps:true}));

const AddTweeterData = async(req, res) => {
      const { id } = req.body;
  const io = req.app.get("io");

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "http://localhost:5000/search/find-by-id",
      { id },
      config
    );
    const data = response.data;

    if (data.error) {
      console.error("Error from find-by-id endpoint:", data.error);
      return res.status(400).json({ message: "Invalid ID or query failed." });
    }

    console.log("Data from find-by-id:", data);

    if (data.count === 1) {
      io.emit("updateRealTimeData", data);

      const llmResponse = await axios.post(
        "http://localhost:5000/gemini/get-one-liner",
        { data },
        config
      );

      const llmOutput = llmResponse.data;

      if (llmOutput.error) {
        console.error("Error from get-one-liner endpoint:", llmOutput.error);
        return res.status(400).json({ message: "Failed to generate one-liner." });
      }

      console.log("One-liner generated:", llmOutput);

      const newData = new DataLlmCollection({
        post_id: id,
        oneLinerInfo: llmOutput["one-liner"],
      });

      await newData.save();

      return res.status(200).json({
        message: "Data added successfully.",
        oneLiner: llmOutput["one-liner"],
      });
    } else {
      return res.status(400).json({
        message: "Count is not 1, data not added.",
      });
    }
  } catch (error) {
    console.error("Internal server error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
    }

  const HandleTweeter = async(req,res)=>{
    
  }

///v1/jaldibanao/updatedata
router.route("/updatedata").post((req, res) => {
  const io = req.app.get("io");
  if (!interval) {
    count = 0; 
    interval = setInterval(() => UpdateData(io), 15000); 
    res.status(200).json({ message: "Real-time data updates started." });
  } else {
    res.status(400).json({ message: "Real-time data updates are already running." });
  }
});

///v1/jaldibanao/addTweet
router.route("/addTweet").post(AddTweeterData)
router.route("/handle").post(HandleTweeter)
export default router;



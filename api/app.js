const express = require("express");
const Airtable = require("airtable");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static("./"));

const airtableApiKey = process.env.AIRTABLE_APIKEY; // Your Airtable API key
const baseId = process.env.AIRTABLE_BASEID; // Your Airtable base ID
const tableName = "Images";
const reactionTableName = "Ratings";

Airtable.configure({
  apiKey: airtableApiKey,
});
const base = Airtable.base(baseId);

let allImages = [];
let currentImageIndex = 0;

const fetchImages = async () => {
  try {
    const records = await base(tableName).select().all();
    allImages = records.map((record) => {
      return {
        id: record.id,
        imageUrl: record.get("url"),
        description: record.get("description"),
      };
    });
    console.log("Images fetched from Airtable.");
  } catch (error) {
    console.error("Error fetching images from Airtable:", error);
  }
};

fetchImages();

app.get("/next-image", (req, res) => {
  if (currentImageIndex >= allImages.length) {
    console.log("All images have been rated.");
    res.json({ endOfImages: true });
  } else {
    res.json(allImages[currentImageIndex++]);
  }
});

app.post("/reaction", async (req, res) => {
  try {
    const { imageId, reaction } = req.body;

    await base(reactionTableName).create({
      image: [imageId],
      reaction: reaction,
    });

    console.log(`Reaction ${reaction} saved for image ID ${imageId}.`);
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving reaction:", error);
    res.status(500).json({ success: false, error: "Error saving reaction" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

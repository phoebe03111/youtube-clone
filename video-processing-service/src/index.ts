import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/process-video", (req, res) => {
  // Get path of the input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    res.status(400).send("Missing input or output file path.");
  }

  // Convert video to 360p
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      res.status(200).send("Video processing finished successfully.");
    })
    .on("error", (err) => {
      console.log(`An error occured: ${err.message}`);
      res.send(500).send(`Internal server error: ${err.message}`);
    })
    .save(outputFilePath);
});

app.listen(port, () => console.log(`Server running on port ${port}`));

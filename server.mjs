// server.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { dirname, join } from "path";
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON bodies

// Enable All CORS Requests for development use only
// For production, you should configure the origins you want to allow
app.use(cors());

// Using `import.meta.url` to get the current file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public' directory where 'index.html' is located
app.use(express.static(path.join(__dirname, "public")));

const user_location = { lat: 1.2760, lng: 103.8007 };

async function searchNearbyClinics(latitude, longitude, radius) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=doctor&key=${apiKey}`;
  const response = await axios.get(url);
  return response.data.results; // Assuming this contains the clinics information
}

function formatClinicsForOpenAI(clinics) {
  let prompt = "Based on the following clinics' information:\n";
  clinics.forEach((clinic, index) => {
      prompt += `\n${index + 1}. Name: ${clinic.name}, Address: ${clinic.vicinity}${clinic.rating ? ', Rating: ' + clinic.rating : ''}`;
      console.log(getCoordinatesForAddress(clinic.vicinity));
  });
  prompt += "\n\nWhich clinic would you recommend and why? You are to assume you are a healthcare assistant that does not provide diagnosis information. Do not say that you are an AI and do not have personal opinions. Include specialisation of location (if any) or general clinic. Indicate personal/corporate shield insurance plans and list them out eg. Great Eastern, Singlife, Prudential, NTUC Income, Parkway Shenton etc..";
  return prompt;
}

async function findClinicsAndAskOpenAI(latitude, longitude, radius) {
  const clinics = await searchNearbyClinics(latitude, longitude, radius);
  if (clinics.length > 0) {
      prompt = formatClinicsForOpenAI(clinics);
      console.log("Prompt: " + prompt);
      return prompt;
  } else {
      console.log("No clinics found in the specified area.");
  }
}

let prompt = findClinicsAndAskOpenAI(user_location.lat, user_location.lng, 1000).catch(console.error);

// app.post(`${process.env.VUE_APP_API_URL}/api/message`, async (req, res) => {
app.post(`/api/message`, async (req, res) => {
  try {
    // Send the message to OpenAI API
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 100,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: req.body.text,
          },
          {
            role: "system",
            content:
              prompt,
              //"You are a healthcare assistant that will provide ACCURATE locations of healthcare avenues in Singapore. Assume user is in Singapore. You will not provide diagnosis. When giving locations, provide accurate postal codes. Include operating hours. Include time/distance away from location. Include specialisation of location (if any) or general clinic. Indicate personal/corporate shield insurance plans and list them out eg. Great Eastern, Singlife, Prudential, NTUC Income, Parkway Shenton etc.. Each location and its details are considered a group. Groups should be separated by a line!! Give it to me in the format of Name, Address, Operating Hours, Specialisation, Insurance Plans and Description",
          },
          // Include previous messages here if applicable
        ],
        // ... other necessary parameters
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI API Response:", openaiResponse.data);

    // Respond with the message from OpenAI
    const responseText = openaiResponse.data.choices[0].message.content;
    console.log("Response Text for Extraction:", responseText); // Debugging: Log the text to be processed
    // const clinicsInfo = extractClinicsInfo(responseText);
    // console.log("Extracted Clinics Info:", clinicsInfo); // Debugging: Log the extracted information

    res.json({ message: responseText });

    // // For brian's geocoding
    // for (let i = 0; i < clinicsInfo.length; i++) {
    //   let coords = await getCoordinatesForAddress(clinicsInfo[i].address);
    //   console.log(coords);
    // }

    // // Function to parse the response text and extract clinic names and addresses
    // function extractClinicsInfo(responseText) {
    //   // Split response into parts for each clinic
    //   const clinicBlocks = responseText.split(/\n\n---\n\n/);

    //   // Define regex for extracting clinic name and address
    //   const clinicInfoRegex = /(.*?) Address: (.*?)(?= Operating Hours)/;

    //   // Array to hold the extracted information
    //   const clinicsInfo = [];

    //   clinicBlocks.forEach(block => {
    //     const nameMatch = block.match(/^\d+\.\s+(.+)$/m); // Matches the clinic name line
    //     const addressMatch = block.match(/Address: (.+)$/m); // Matches the address line
    //     if (nameMatch && addressMatch) {
    //       clinicsInfo.push({
    //         name: nameMatch[1].trim(),
    //         address: addressMatch[1].trim(),
    //       });
    //     }
    //   });

    //   return clinicsInfo;
    // }
  } catch (error) {
    console.error(
      "Error making request to OpenAI:",
      error.response ? error.response.data : error
    );
    res.status(500).send("Error processing the request");
  }
});

async function getCoordinatesForAddress(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Geocoding request was not successful for the following reason: ' + response.data.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates from Google Maps Geocoding API:', error);
    throw error;
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import dotenv from 'dotenv';
// import axios from 'axios';
// import fs from 'fs';
// dotenv.config();

// class DownloadFile {
//     constructor() {
//     }

//     static async downloadFile(fileUrl) {

//         try {

//             // Define the file path where you want to save the downloaded file
//             const fileName = generateFileName() + ".wav"
//             const filePath = `./records/${fileName}`; // Replace with your desired file path and name

//             // Use Axios to make an HTTP GET request to the file URL
//             const response = await axios.get(fileUrl, { responseType: 'stream' });

//             // Create a writable stream to save the file
//             const writer = fs.createWriteStream(filePath);

//             // Pipe the response data to the writable stream
//             response.data.pipe(writer);

//             // Wait for the file to finish downloading
//             await new Promise((resolve, reject) => {
//                 writer.on('finish', resolve);
//                 writer.on('error', reject);
//             });

//             return fileName;
            
//         } catch (error) {
//             return false;
//             console.error('Error downloading the file:', error);
//         }

//     }

// }


// export default DownloadFile;


// function generateFileName() {

//     const date = new Date();
//     const day = date.getDate(); // Get the day (1-31)
//     const month = date.getMonth() + 1; // Get the month (0-11); add 1 to get the correct month number (1-12)
//     const year = date.getFullYear(); // Get the year (e.g., 2023)
//     const hour = date.getHours(); // Get the hour (0-23)
//     const minute = date.getMinutes(); // Get the minute (0-59)

//     const min = Math.pow(10, 5 - 1);
//     const max = Math.pow(10, 5) - 1;
//     const numberRandom = Math.floor(Math.random() * (max - min + 1)) + min;

//     const fileName = `record_${numberRandom + "_" + day + "_" + month + "_" + year + "_" + hour + "_" + minute}`;
//     return fileName
// }
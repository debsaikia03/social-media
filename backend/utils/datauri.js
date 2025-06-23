//datauri: converts the image to a URI

import DataUriParser from "datauri/parser.js"; // Importing the Datauri library
import path from "path"; // Importing the path module

const parser = new DataUriParser(); // Creating a new instance of the Datauri class

const getDataUri = (file) => { // Function to convert the image to a data URI

    const extName = path.extname(file.originalname).toString(); // Getting the extension of the image file

    return parser.format(extName, file.buffer).content; // Returning the data URI of the image
};

export default getDataUri; // Exporting the getDataUri function to be used in other files
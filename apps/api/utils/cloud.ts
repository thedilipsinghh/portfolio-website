import { v2 as cloud } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

cloud.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_API_NAME,
});

export default cloud;

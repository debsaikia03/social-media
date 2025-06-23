import jwt from "jsonwebtoken";

//check if user is authenticated (logged in or not) or not by checking if the token is present in the cookies
const isAuthenticated = async (req, res, next) => {

    try{
       
        const token = req.cookies.token; // Getting the token from the cookies
        if(!token){
            return res.status(401).json({
                message: "User not authenticated!",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY); // Verifying the token using the SECRET_KEY environment variable
        if(!decode){
            return res.status(401).json({
                message: "Invalid token!",
                success: false
            });
        }

        req.id = decode.userId; // Setting the user id in the request object

        next(); // Calling the next middleware if the user is authenticated

    } catch (error){

        console.error(`Error: ${error.message}`);
    }
};

export default isAuthenticated; // Exporting the isAuthenticated middleware to be used in other files

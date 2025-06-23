import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice.js";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      console.log("Fetching suggested users..."); // ✅ check if this prints
      try {
        const res = await axios.get("https://social-media-ttfc.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });
        console.log("API Response:", res.data); // ✅ Add this
        if (res.data.success) {
          console.log("Fetched suggested users:", res.data.users); // Should print now
          dispatch(setSuggestedUsers(res.data.users));
        } else {
          console.log("API call succeeded but 'success' was false");
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;

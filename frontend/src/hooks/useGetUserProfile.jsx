import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice.js";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  //const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching suggested users..."); // ✅ check if this prints
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data); // ✅ Add this
        if (res.data.success) {
          console.log("Fetched suggested users:", res.data.users); // Should print now
          dispatch(setUserProfile(res.data.user));
        } else {
          console.log("API call succeeded but 'success' was false");
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;

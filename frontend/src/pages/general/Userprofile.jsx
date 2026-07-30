import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/profile.css";

const Profile = () => {

    const [user, setUser] = useState(null);
    const [savedReels, setSavedReels] = useState([]);

    const API = import.meta.env.VITE_API_URL;


    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            // Get current logged in user
            const userResponse = await axios.get(
                `${API}/api/auth/me`,
                {
                    withCredentials: true
                }
            );

            setUser(userResponse.data.user);



            // Get saved reels
            const reelsResponse = await axios.get(
                `${API}/api/food/saved`,
                {
                    withCredentials: true
                }
            );

            setSavedReels(reelsResponse.data.savedReels);


        } catch (error) {

            console.log(error);

        }

    };


    const logout = async () => {

        try {

            await axios.get(
                `${API}/api/auth/user/logout`,
                {
                    withCredentials: true
                }
            );


            window.location.href = "/user/login";


        } catch(error){

            console.log(error);

        }

    };



    return (

        <div className="profile-page">


            {
                user &&

                <>

                    <div className="profile-card">

                        <div className="profile-avatar">
                            {user.fullName?.charAt(0)}
                        </div>


                        <h2>
                            {user.fullName}
                        </h2>


                        <p>
                            {user.email}
                        </p>


                        <button 
                            className="logout-btn"
                            onClick={logout}
                        >
                            Logout
                        </button>


                    </div>



                    <div className="saved-container">

                        <h3>
                            Saved Reels
                        </h3>


                        {
                            savedReels.length === 0 ?

                            (
                                <p>
                                    No saved reels yet
                                </p>
                            )

                            :

                            (

                                <div className="saved-grid">

                                    {
                                        savedReels.map((reel)=>(

                                            <div 
                                                className="reel-card"
                                                key={reel._id}
                                            >

                                                <video
                                                    src={reel.video}
                                                    controls
                                                />

                                                <h4>
                                                    {reel.name}
                                                </h4>

                                            </div>

                                        ))
                                    }

                                </div>

                            )

                        }


                    </div>


                </>

            }


        </div>

    )
}


export default Profile;
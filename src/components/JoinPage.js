import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


const API_URL = process.env.REACT_APP_BACKEND;

function JoinPage({ onJoinRoom }) {

    const { roomName } = useParams();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!userName) return toast.error("Enter your name");
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/join-meet`, {
                roomName,
                userIdentity: userName,
            });
            if (res.data.success) {
                onJoinRoom(res.data);
            } else {
                toast.error(res.data.message || "Failed to join");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-page-container">
            <h2>Join Room: {roomName}</h2>
            <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Enter your name"
            />
            <button onClick={handleJoin} disabled={loading || !userName}>
                {loading ? "Joining..." : "Join"}
            </button>
        </div>
    );
}

export default JoinPage;

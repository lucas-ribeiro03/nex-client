import { useEffect, useState } from "react";
import styles from "./style.module.scss";

import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FollowsProps {
  onClose: () => void;
}

interface Follower {
  followerUser: {
    username: string;
  };
}

export const Follows: React.FC<FollowsProps> = ({ onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  const [followers, setFollowers] = useState<string[]>([]);

  useEffect(() => {
    const getFollowers = async () => {
      const response = await axios.get(
        `${apiUrl}/users/${username}/followers`,
        { headers: { accessToken: localStorage.getItem("token") } }
      );
      setFollowers(
        response.data.followers.map(
          (follower: Follower) => follower.followerUser.username
        )
      );
    };
    getFollowers();
  }, []);

  return (
    <div className={styles.mdFollowsBody}>
      <div className={styles.mdFollowsContainer}>
        {followers} <IoMdClose onClick={onClose} />
      </div>
    </div>
  );
};

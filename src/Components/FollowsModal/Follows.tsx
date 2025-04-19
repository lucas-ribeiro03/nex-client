import { useEffect, useState } from "react";
import styles from "./style.module.scss";

import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FollowsProps {
  onClose: () => void;
  showFollowers: boolean;
  showFollowings: boolean;
}

interface Follower {
  followerUser: {
    username: string;
  };
}

interface Follow {
  followingUser: {
    username: string;
  };
}

export const Follows: React.FC<FollowsProps> = ({
  onClose,
  showFollowers,
  showFollowings,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    const getFollows = async () => {
      const response = await axios.get(
        `${apiUrl}/users/${username}/followers`,
        { headers: { accessToken: localStorage.getItem("token") } }
      );
      setFollowers(
        response.data.followers.map(
          (follower: Follower) => follower.followerUser.username
        )
      );

      setFollowing(
        response.data.following.map(
          (follow: Follow) => follow.followingUser.username
        )
      );
    };
    getFollows();
  }, [apiUrl, username]);

  return (
    <div className={styles.mdFollowsBody}>
      <div className={styles.mdFollowsContainer}>
        {showFollowers && (
          <div className={styles.followersContainer}>
            <IoMdClose onClick={onClose} />
            {followers.map((follower) => (
              <div key={follower} className={styles.follower}>
                {follower}
              </div>
            ))}
          </div>
        )}
        {showFollowings && (
          <div className={styles.followingsContainer}>
            <IoMdClose onClick={onClose} />
            {following.map((follow) => (
              <div key={follow} className={follow}>
                {follow}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

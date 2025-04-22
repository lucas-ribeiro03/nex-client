/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

import { IoMdClose } from "react-icons/io";
import axios from "axios";

interface WhoLikedModalProps {
  onClose: () => void;
  postId: string;
}

interface WhoLiked {
  username: string;
}

interface UserWhoLiked {
  user: {
    username: string;
  };
}

export const WhoLikedModal: React.FC<WhoLikedModalProps> = ({
  onClose,
  postId,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [whoLiked, setWhoLiked] = useState<WhoLiked[]>([]);

  useEffect(() => {
    const getWhoLiked = async () => {
      const response = await axios.get(
        `${apiUrl}/postlikes/wholiked/${postId}`
      );

      setWhoLiked(
        response.data.map((userWhoLiked: UserWhoLiked) => ({
          username: userWhoLiked.user.username,
        }))
      );
    };

    getWhoLiked();
  }, [apiUrl]);

  return (
    <div className={styles.mdWhoLikedBody}>
      <div className={styles.mdWhoLikedContainer}>
        <h3>Curtido por</h3>
        {whoLiked.map((user, index) => (
          <div key={index} className={styles.userContainer}>
            {user.username}
          </div>
        ))}
        <IoMdClose onClick={onClose} />
      </div>
    </div>
  );
};

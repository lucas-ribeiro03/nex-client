import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MdEditProfileProps {
  onClose: () => void;
}

export const MdEditProfile: React.FC<MdEditProfileProps> = ({ onClose }) => {
  const [user, setUser] = useState({
    nickname: "",
    bio: "",
  });
  const { username } = useParams();
  useEffect(() => {
    const getUserInfo = async () => {
      const response = await axios.get(
        `nex-client-production.up.railway.app/auth/${username}`,
        { headers: { accessToken: localStorage.getItem("token") } }
      );
      setUser({
        bio: response.data.user.bio,
        nickname: response.data.user.nickname,
      });
    };
    getUserInfo();
  }, [username]);

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .put(
        `nex-client-production.up.railway.app/auth/`,
        {
          nickname: user.nickname,
          bio: user.bio,
        },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then(onClose);
  };
  return (
    <>
      <div className={styles.editProfileBody}>
        <div className={styles.mdEditProfile}>
          <form onSubmit={handleEditProfile}>
            <label htmlFor="nickname">nickname </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={user.nickname}
              onChange={(e) =>
                setUser({
                  bio: user.bio,
                  nickname: e.target.value,
                })
              }
            />
            <label htmlFor="bio">bio </label>
            <textarea
              id="bio"
              name="bio"
              maxLength={100}
              onChange={(e) =>
                setUser({
                  bio: e.target.value,
                  nickname: user.nickname,
                })
              }
              value={user.bio}
              placeholder="Max 100 caractéres"
            />
            <button>Confirmar</button>
          </form>
          <IoMdClose className={styles.closeBtnMd} onClick={onClose} />
        </div>
      </div>
    </>
  );
};

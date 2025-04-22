import axios from "axios";
import styles from "./style.module.scss";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface MdCreatePostProps {
  onClose: () => void;
}

export const MdCreatePost: React.FC<MdCreatePostProps> = ({ onClose }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [postContent, setPostContent] = useState("");
  const navigate = useNavigate();

  const handleSendPost = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postContent) return toast.error("Post não pode estar vazio");
    await axios
      .post(
        `${apiUrl}/posts`,
        {
          content: postContent,
        },
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {});
    navigate(0);

    setPostContent("");
  };

  return (
    <div className={styles.mdBody}>
      <ToastContainer />
      <div className={styles.mdContainer}>
        <form onSubmit={handleSendPost}>
          <textarea
            placeholder="O que estou pensando..."
            value={postContent}
            maxLength={255}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button>Postar</button>
        </form>
        <button onClick={onClose} className={styles.closeBtn}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

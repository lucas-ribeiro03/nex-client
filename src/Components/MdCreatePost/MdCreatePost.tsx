import axios from "axios";
import styles from "./style.module.scss";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface MdCreatePostProps {
  onClose: () => void;
}

export const MdCreatePost: React.FC<MdCreatePostProps> = ({ onClose }) => {
  const [postContent, setPostContent] = useState("");

  const handleSendPost = async () => {
    if (!postContent) return toast.error("Post não pode estar vazio");
    await axios.post(
      "nex-client-production.up.railway.app/posts",
      {
        content: postContent,
      },
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );
    setPostContent("");
  };

  return (
    <div className={styles.mdBody}>
      <ToastContainer />
      <div className={styles.mdContainer}>
        <form>
          <textarea
            placeholder="O que estou pensando..."
            value={postContent}
            maxLength={255}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <button onClick={handleSendPost}>Postar</button>
        </form>
        <button onClick={onClose} className={styles.closeBtn}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

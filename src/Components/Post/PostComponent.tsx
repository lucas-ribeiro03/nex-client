import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Comment, Post } from "../../data/interfaces";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export const PostComponent: React.FC = () => {
  const [comment, setComment] = useState("");
  const [isLikedPost, setIsLikedPost] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post>({
    content: "",
    id: "",
    user: {
      username: "",
    },
    userId: "",
    likes: [],
  });

  const [userLogged, setUserLogged] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const checkLikes = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/postLikes/${id}`,
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.message === "Post Curtido") setIsLikedPost(true);
    };

    checkLikes();
  }, [id]);

  useEffect(() => {
    const getComments = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/comments/${id}`
      );

      setComments(response.data);
    };
    getComments();
  }, [id]);

  useEffect(() => {
    const getPost = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/posts/${id}`
      );
      setPost(response.data);
    };
    getPost();
  }, [id]);

  useEffect(() => {
    const checkUser = async () => {
      const response = await axios.get(
        "https://nex-client-production.up.railway.app/auth",
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      );
      if (!response.data.error) setUserLogged(response.data.username);
    };
    checkUser();
  }, []);

  const handleSubmitComment = async () => {
    if (comment === "") return toast.error("Comentário não pode estar vazio");
    const response = await axios.post(
      "https://nex-client-production.up.railway.app/comments",
      {
        content: comment,
        postId: id,
        user: { username: "" },
      },
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );
    if (response.data.error) return toast.error(response.data.error);
    setComments((prev) => [response.data, ...prev]);
    setComment("");
    navigate(0);
  };

  const handleDeleteComment = async (id: string) => {
    const response = await axios.delete(
      `https://nex-client-production.up.railway.app/comments/${id}`
    );
    if (!response.data.error) {
      setComments(comments.filter((comment) => comment.id !== id));
    }
  };

  const handleDislike = async (id: string) => {
    await axios
      .delete(`https://nex-client-production.up.railway.app/postLikes/${id}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then(() => setIsLikedPost(false));
  };

  const handleLike = async () => {
    await axios
      .post(
        "https://nex-client-production.up.railway.app/postLikes",
        {
          postId: id,
          userId: "",
        },
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      )
      .then(() => setIsLikedPost(true));
  };

  return (
    <>
      <div className={styles.postBody}>
        <ToastContainer />
        <div className={styles.post}>
          <span>{post.user.username}</span>
          <p>{post.content}</p>
          {isLikedPost ? (
            <IoMdHeart
              className={styles.likeBtn}
              onClick={() => handleDislike(post.id)}
            />
          ) : (
            <IoMdHeartEmpty onClick={handleLike} />
          )}
        </div>
        <div className={styles.commentSection}>
          <textarea
            placeholder="Comente..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button onClick={handleSubmitComment}>Enviar</button>
          <div className={styles.commentsContainer}>
            {comments.map((comment, key) => (
              <div key={key} className={styles.commentContainer}>
                <strong>{comment.user.username}</strong>
                <p>{comment.content}</p>
                {userLogged === comment.user.username && (
                  <FaTrashAlt
                    onClick={() => handleDeleteComment(comment.id)}
                    className={styles.deleteCommentBtn}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

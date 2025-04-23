/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Comment, Post } from "../../data/interfaces";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export const PostComponent: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
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
      const response = await axios.get(`${apiUrl}/postLikes/${id}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });
      if (response.data.message === "Post Curtido") setIsLikedPost(true);
    };

    checkLikes();
  }, [id]);

  useEffect(() => {
    const getComments = async () => {
      const response = await axios.get(`${apiUrl}/comments/${id}`);

      setComments(response.data);
    };
    getComments();
  }, [id]);

  useEffect(() => {
    const getPost = async () => {
      const response = await axios.get(`${apiUrl}/posts/${id}`);
      setPost(response.data);
    };
    getPost();
  }, [id]);

  useEffect(() => {
    const checkUser = async () => {
      const response = await axios.get(`${apiUrl}/auth`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });
      if (!response.data.error) setUserLogged(response.data.username);
    };
    checkUser();
  }, []);

  const handleSubmitComment = async () => {
    if (comment === "") return toast.error("Comentário não pode estar vazio");
    const response = await axios.post(
      `${apiUrl}/comments`,
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
    await axios
      .post(
        `${apiUrl}/notifications/comment`,
        { postId: id },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then();

    setComments((prev) => [response.data, ...prev]);
    navigate(0);
    setComment("");
  };

  const handleDeleteComment = async (id: string) => {
    const response = await axios.delete(`${apiUrl}/comments/${id}`);
    if (!response.data.error) {
      setComments(comments.filter((comment) => comment.id !== id));
    }
  };

  const handleDislike = async (id: string) => {
    await axios
      .delete(`${apiUrl}/postLikes/${id}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      })
      .then(() => setIsLikedPost(false));
  };

  const handleLike = async () => {
    await axios
      .post(
        `${apiUrl}/postLikes`,
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

    await axios
      .post(
        `${apiUrl}/notifications/like`,
        { id },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then();
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

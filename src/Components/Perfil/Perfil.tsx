import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import axios from "axios";
import { Post, User } from "../../data/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { MdEditProfile } from "../MdEditProfile/MdEditProfile";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";

export const Perfil: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState<string[]>([]);
  const [follows, setFollows] = useState({
    follower: 0,
    following: 0,
  });
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({
    bio: "",
    data_entrada: "",
    username: "",
    id: "",
    nickname: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState<"Viewer" | "Owner">();

  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/auth/${username}`,
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.state === "Owner") {
        setMode("Owner");
      } else {
        setMode("Viewer");
      }
      const createdAt = new Date(response.data.user.createdAt);
      const formattedDate = createdAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      setUser({
        bio: response.data.user.bio,
        data_entrada: formattedDate,
        username: response.data.user.username,
        id: response.data.user.id,
        nickname: response.data.user.nickname,
      });
    };
    getUser();
  }, [username]);
  useEffect(() => {
    const checkLikes = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/postLikes`,
        {
          headers: {
            accessToken: localStorage.getItem("token"),
          },
        }
      );
      const postsLikedArray = response.data.map((post: { postId: string }) => {
        return post.postId;
      });
      setLikedPosts(postsLikedArray);
    };
    checkLikes();
  }, []);

  useEffect(() => {
    const getFollows = async () => {
      const response = await axios.get(
        `https://nex-client-production.up.railway.app/users/${username}/followers`,
        { headers: { accessToken: localStorage.getItem("token") } }
      );

      const follower = response.data.followers.length;
      const following = response.data.following.length;
      setFollows({ follower, following });
    };
    getFollows();
  }, [isFollowing, username]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `https://nex-client-production.up.railway.app/posts/userPosts/${username}`,
          {
            headers: {
              accessToken: localStorage.getItem("token"),
            },
          }
        );
        setUserPosts(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    getPosts();
  }, [username]);

  const handleFollowUser = async (id: string) => {
    const response = await axios.post(
      `https://nex-client-production.up.railway.app/users/${id}/follow`,
      {},
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );

    setIsFollowing((prev) => [...prev, response.data.followingId]);
  };

  const handleClick = async (id: string) => {
    navigate(`/post/${id}`);
  };

  const handleUnfollowUser = async (username: string) => {
    const response = await axios.delete(
      `https://nex-client-production.up.railway.app/users/${username}`,
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );

    setIsFollowing(
      isFollowing.filter((followingId) => followingId !== response.data)
    );
  };

  const handleLike = async (id: string) => {
    const response = await axios.post(
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
    );

    setLikedPosts((prev) => [...prev, response.data.postId]);
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === response.data.postId
          ? {
              ...post,
              likes: [
                ...(Array.isArray(post.likes) ? post.likes : []),
                { userId: response.data.userId },
              ],
            }
          : post
      )
    );
  };

  const handleDislike = async (id: string) => {
    const response = await axios.delete(
      `https://nex-client-production.up.railway.app/postLikes/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );

    setLikedPosts((prev) => prev.filter((liked) => liked !== response.data));

    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              likes: post.likes.slice(0, -1),
            }
          : post
      )
    );
  };

  const handleDeletePost = async (id: string) => {
    await axios
      .delete(`https://nex-client-production.up.railway.app/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("token") },
      })
      .then(() => navigate(0));
  };

  return (
    <>
      <div className={styles.perfilBody}>
        <div className={styles.perfilHeader}>
          <div className={styles.perfilNavContainer}>
            <nav>
              <span className={styles.username} style={{ gridArea: "box1" }}>
                {user.username}
              </span>
              <strong style={{ gridArea: "box6" }}>{user.nickname}</strong>
              <span style={{ gridArea: "box2" }}>{user.bio}</span>
              <span
                style={{ gridArea: "box3" }}
              >{`Ingressou em ${user.data_entrada}`}</span>
              <span
                style={{ gridArea: "box4" }}
              >{`${follows.following} seguindo`}</span>
              <span
                style={{ gridArea: "box5" }}
              >{`${follows.follower} seguidores`}</span>
            </nav>
          </div>
          <div className={styles.rightSide}>
            {mode === "Owner" ? (
              <button onClick={() => setIsModalOpen(true)}>
                Editar perfil
              </button>
            ) : isFollowing.includes(user.id) ? (
              <button onClick={() => handleUnfollowUser(user.username)}>
                Deixar de seguir
              </button>
            ) : (
              <button onClick={() => handleFollowUser(user.username)}>
                Seguir
              </button>
            )}
          </div>
        </div>

        <span
          style={{
            color: "#fff",
          }}
        >
          Posts
        </span>
        <div className={styles.userPosts}>
          {userPosts.map((userPost, key) => (
            <div key={key} className={styles.userPost}>
              {username === user.username ? (
                <FaTrashAlt
                  onClick={() => handleDeletePost(userPost.id)}
                  className={styles.trash}
                />
              ) : null}
              <h3>{user.username}</h3>
              <p>{userPost.content}</p>
              <div className={styles.reactions}>
                <IoChatboxOutline
                  className={styles.commentBtn}
                  onClick={() => handleClick(userPost.id)}
                />

                <div className={styles.likeContainer}>
                  {likedPosts.includes(userPost.id) ? (
                    <IoMdHeart
                      style={{ fill: "red" }}
                      className={styles.heartBtn}
                      onClick={() => handleDislike(userPost.id)}
                    />
                  ) : (
                    <IoMdHeartEmpty
                      className={styles.heartBtn}
                      onClick={() => handleLike(userPost.id)}
                    />
                  )}
                  {userPost.likes.length}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mode === "Owner" && isModalOpen && (
          <MdEditProfile
            onClose={() => {
              setIsModalOpen(false);
              navigate(0);
            }}
          />
        )}
      </div>
    </>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import axios from "axios";
import { Post, User } from "../../data/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { MdEditProfile } from "../MdEditProfile/MdEditProfile";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { Follows } from "../FollowsModal/Follows";
import { WhoLikedModal } from "../WhoLikedModal/WhoLikedModal";

interface Follower {
  followerId: string;
}

interface WhoLiked {
  postId: string;
  user: {
    username: string;
  };
}
export const Perfil: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userLogged, setUserLogged] = useState("");
  const [showFollows, setShowFollows] = useState<
    "followers" | "following" | null
  >(null);
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

  const [whoLikedModalPostId, setWhoLikedModalPostId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mode, setMode] = useState<"Viewer" | "Owner">();
  const [whoLiked, setWhoLiked] = useState<WhoLiked[]>([]);

  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${apiUrl}/auth/${username}`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });

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
    const getWhoLiked = async () => {
      const response = await axios.get(`${apiUrl}/postlikes/wholiked`);

      setWhoLiked(response.data);
    };
    getWhoLiked();
  }, [apiUrl]);

  useEffect(() => {
    const checkLikes = async () => {
      const response = await axios.get(`${apiUrl}/postLikes`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });
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
        `${apiUrl}/users/${username}/followers`,
        { headers: { accessToken: localStorage.getItem("token") } }
      );

      const follower = response.data.followers.length;
      const following = response.data.following.length;
      setFollows({ follower, following });
      setIsFollowing((prev) => [
        ...prev,
        ...response.data.followers.map(
          (follower: Follower) => follower.followerId
        ),
      ]);

      setUserLogged(response.data.user);
    };
    getFollows();
  }, [username]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/posts/userPosts/${username}`,
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
      `${apiUrl}/users/${id}/follow`,
      {},
      {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      }
    );
    setIsFollowing((prev) => [...prev, response.data.followingId]);

    await axios
      .post(
        `${apiUrl}/notifications/follow`,
        { username: id },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then();
  };

  const handleClick = async (id: string) => {
    navigate(`/post/${id}`);
  };

  const handleUnfollowUser = async (username: string) => {
    const response = await axios.delete(`${apiUrl}/users/${username}`, {
      headers: {
        accessToken: localStorage.getItem("token"),
      },
    });

    setIsFollowing(
      isFollowing.filter((followingId) => followingId !== response.data)
    );
  };

  const handleLike = async (id: string) => {
    const response = await axios.post(
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

    await axios
      .post(
        `${apiUrl}/notifications/like`,
        { id },
        { headers: { accessToken: localStorage.getItem("token") } }
      )
      .then();
  };

  const handleDislike = async (id: string) => {
    const response = await axios.delete(`${apiUrl}/postLikes/${id}`, {
      headers: {
        accessToken: localStorage.getItem("token"),
      },
    });

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
      .delete(`${apiUrl}/posts/${id}`, {
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

              {/* SPAN FOLLOWINGS */}
              <span
                className={styles.followings}
                onClick={() => {
                  setShowFollows("following");
                }}
                style={{ gridArea: "box4" }}
              >{`${follows.following} seguindo`}</span>
              {showFollows && (
                <Follows
                  onClose={() => setShowFollows(null)}
                  showFollowers={showFollows === "followers"}
                  showFollowings={showFollows === "following"}
                />
              )}

              {/* SPAN FOLLOWERS */}
              <span
                onClick={() => {
                  setShowFollows("followers");
                }}
                style={{ gridArea: "box5" }}
                className={styles.followers}
              >{`${follows.follower} seguidores`}</span>
              {showFollows && (
                <Follows
                  showFollowers={showFollows === "followers"}
                  showFollowings={showFollows === "following"}
                  onClose={() => {
                    setShowFollows(null);
                  }}
                />
              )}
            </nav>
          </div>
          <div className={styles.rightSide}>
            {mode === "Owner" ? (
              <button onClick={() => setIsModalOpen(true)}>
                Editar perfil
              </button>
            ) : isFollowing.includes(userLogged) ? (
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
          {userPosts.map((userPost, key) => {
            const firstLike = whoLiked.find(
              (first) => userPost.id === first.postId
            );
            return (
              <div key={key} className={styles.userPost}>
                {mode === "Owner" ? (
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
                    {firstLike && (
                      <span
                        onClick={() => setWhoLikedModalPostId(userPost.id)}
                        className={styles.wholiked}
                        style={{ cursor: "pointer" }}
                      >
                        Curtido por {firstLike.user.username}
                        {userPost.likes.length > 1 ? (
                          <span>e mais {userPost.likes.length - 1}</span>
                        ) : null}
                      </span>
                    )}

                    {whoLikedModalPostId === userPost.id && (
                      <WhoLikedModal
                        postId={userPost.id}
                        onClose={() => setWhoLikedModalPostId(null)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

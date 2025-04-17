import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Post } from "../../data/interfaces";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoChatboxOutline } from "react-icons/io5";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaUserPlus, FaCheck, FaSearch } from "react-icons/fa";

interface Suggestion {
  username: string;
}

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState<string[]>([]);
  const [user, setUser] = useState("");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getPosts = async () => {
      axios.get(`${apiUrl}/posts`).then((response) => {
        setPosts(response.data);
        console.log(response.data);
      });
    };
    getPosts();
  }, []);

  useEffect(() => {
    const authUser = async () => {
      const response = await axios.get(`${apiUrl}/auth`, {
        headers: { accessToken: localStorage.getItem("token") },
      });
      if (response.data.error) return;
      setUser(response.data.username);
    };
    authUser();
  }, []);

  const handleClick = async (id: string) => {
    navigate(`/post/${id}`);
  };

  useEffect(() => {
    const getFollows = async () => {
      if (!user) return;
      const response = await axios.get(`${apiUrl}/users/${user}/followers`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });

      const followingIds = response.data.following.map(
        (followId: { followingId: string }) => {
          return followId.followingId;
        }
      );

      setIsFollowing(followingIds);
    };
    getFollows();
  }, [user]);

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

  const handleGetUser = async (username: string) => {
    const response = await axios.get(`${apiUrl}/auth/${username}`, {
      headers: {
        accessToken: localStorage.getItem("token"),
      },
    });
    navigate(`/perfil/${response.data.user.username}`);
  };

  useEffect(() => {
    const checkLikes = async () => {
      const response = await axios.get(`${apiUrl}/postLikes`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });
      if (response.data.error) return;
      const postsLikedArray = response.data.map((post: { postId: string }) => {
        return post.postId;
      });
      setLikedPosts(postsLikedArray);
    };
    checkLikes();
  }, []);

  const handleDislike = async (id: string) => {
    const response = await axios.delete(`${apiUrl}/postLikes/${id}`, {
      headers: {
        accessToken: localStorage.getItem("token"),
      },
    });

    setLikedPosts((prev) => prev.filter((liked) => liked !== response.data));

    setPosts((prevPosts) =>
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
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === response.data.postId
          ? {
              ...post,
              likes: [...post.likes, { userId: response.data.userId }] as {
                userId: string;
              }[],
            }
          : post
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (search.trim() === "") return setSuggestions([]);
      try {
        const response = await axios.post(`${apiUrl}/auth/search-users`, {
          username: search,
        });
        setSuggestions(response.data);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    });

    return () => clearTimeout(debounceTimer);
  }, [search]);

  return (
    <div className={styles.body}>
      <div className={styles.searchInput}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Procurar usuário"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <FaSearch />
          </div>
        </form>
        {search && (
          <div className={styles.suggestions}>
            {suggestions.map((user, index) => (
              <div
                className={styles.suggestionItem}
                key={index}
                onClick={() => handleGetUser(user.username)}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.posts}>
        {posts
          ? posts.map((post, key) => (
              <div key={key} className={styles.postContainer}>
                <div className={styles.postContainerHeader}>
                  <h3 onClick={() => handleGetUser(post.user.username)}>
                    {post.user.username}
                  </h3>
                  {user === post.user.username ? null : isFollowing.includes(
                      post.userId
                    ) ? (
                    <span
                      title="Deixar de seguir"
                      onClick={() => handleUnfollowUser(post.user.username)}
                    >
                      Seguindo <FaCheck />
                    </span>
                  ) : (
                    <button
                      onClick={() => handleFollowUser(post.user.username)}
                    >
                      <FaUserPlus />
                    </button>
                  )}
                </div>

                <p>{post.content}</p>

                <div className={styles.reactions}>
                  <IoChatboxOutline
                    className={styles.commentBtn}
                    onClick={() => handleClick(post.id)}
                  />

                  <div className={styles.likeContainer}>
                    {likedPosts.includes(post.id) ? (
                      <IoMdHeart
                        style={{ fill: "red" }}
                        className={styles.heartBtn}
                        onClick={() => handleDislike(post.id)}
                      />
                    ) : (
                      <IoMdHeartEmpty
                        className={styles.heartBtn}
                        onClick={() => handleLike(post.id)}
                      />
                    )}
                    <span>{post.likes.length}</span>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

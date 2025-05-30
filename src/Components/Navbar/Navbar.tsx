/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./style.module.scss";
import { AiFillHome } from "react-icons/ai";
import { IoMdPerson } from "react-icons/io";
import { TbDots } from "react-icons/tb";
import logo from "../../../public/logoNex.png";
import { useEffect, useState } from "react";
import { MdCreatePost } from "../MdCreatePost/MdCreatePost";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "../../redux/root-reducer";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { saveLogin } from "../../redux/isLoggedReducer/isLogged-slice";
import { FaBell } from "react-icons/fa";

interface Notification {
  id: string;
  isRead: boolean;
  notificationType: string;
  sender: {
    username: string;
  };
  postId?: string;
}

interface NavbarProps {
  onclose: () => void;
  notifications: Notification[];
}

export const Navbar: React.FC<NavbarProps> = ({ onclose, notifications }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const notReadNotificationsAmount =
    notifications.length > 0
      ? notifications.filter((notification) => notification.isRead !== true)
      : [];

  useEffect(() => {
    console.log(notReadNotificationsAmount);
  }, []);

  const { isLogged } = useSelector(
    (rootReducer: RootReducer) => rootReducer.isLoggedReducer
  );

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${apiUrl}/auth`, {
        headers: {
          accessToken: localStorage.getItem("token"),
        },
      });
      setUsername(response.data.username);
    };
    if (isLogged) getUser();
  }, [isLogged]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(saveLogin(false));
    navigate("/");
    navigate(0);
  };

  const navigate = useNavigate();
  return (
    <div
      className={styles.navContainer}
      onClick={() => (menuVisible ? setMenuVisible(false) : null)}
    >
      <IoMdClose className={styles.closeBtn} onClick={onclose} />
      <nav>
        <img src={logo} width={120} height={120} />
        <ul>
          <li>
            <a
              href="/"
              onClick={() => {
                if (window.innerWidth < 480) {
                  onclose();
                }
              }}
            >
              <AiFillHome />
              Home
            </a>
          </li>
          <li>
            {isLogged ? (
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/perfil/${username}`);
                  if (window.innerWidth < 480) {
                    onclose();
                  }
                }}
              >
                <IoMdPerson />
                Perfil
              </a>
            ) : (
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                  if (window.innerWidth < 480) {
                    onclose();
                  }
                }}
              >
                <IoMdPerson />
                Login
              </a>
            )}
          </li>
          <li>
            <a
              className={styles.notificationLink}
              href=""
              onClick={(e) => {
                e.preventDefault();
                navigate("/notifications");
                if (window.innerWidth < 480) {
                  onclose();
                }
              }}
            >
              <div className={styles.notificationsLength}>
                {notReadNotificationsAmount.length}
              </div>
              <FaBell />
              Notificações
            </a>
          </li>
        </ul>

        <button onClick={() => setIsModalOpen(true)}>Postar</button>

        <div className={styles.profileContainer}>
          {/* <img src="" alt="" /> */}
          {username}
          <TbDots
            style={{ cursor: "pointer" }}
            onClick={() => isLogged && setMenuVisible(true)}
          />
          {menuVisible && (
            <div className={styles.menu} onClick={handleLogout}>
              <p>Sair</p>
            </div>
          )}
        </div>
      </nav>

      {isModalOpen && isLogged && (
        <MdCreatePost onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

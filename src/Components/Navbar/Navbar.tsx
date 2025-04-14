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
import axios from "axios";
import { saveLogin } from "../../redux/isLoggedReducer/isLogged-slice";

export const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();

  const { isLogged } = useSelector(
    (rootReducer: RootReducer) => rootReducer.isLoggedReducer
  );

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get("http://localhost:3000/auth", {
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
      <nav>
        <img src={logo} width={120} height={120} />
        <ul>
          <li>
            <a href="/">
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
                }}
              >
                <IoMdPerson />
                Login
              </a>
            )}
          </li>
          <li></li>
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

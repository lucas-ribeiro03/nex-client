/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./styles/global.module.scss";
import { Home } from "./Components/Home/Home";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PostComponent } from "./Components/Post/PostComponent";
import { Perfil } from "./Components/Perfil/Perfil";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useWindowSize } from "./hooks/useWindowSize";
import { Notifications } from "./Components/Notifications/Notifications";
import axios from "axios";

interface Notification {
  id: string;
  isRead: boolean;
  notificationType: string;
  sender: {
    username: string;
  };
  postId?: string;
}

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { width, isKeyboardOpen } = useWindowSize();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getNotifications = async () => {
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { accessToken: localStorage.getItem("token") },
      });
      console.log(response);
      setNotifications(response.data);
    };

    getNotifications();
  }, []);

  useEffect(() => {
    if (width < 768 && !isKeyboardOpen) {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }
  }, [width, isKeyboardOpen]);

  const handleOpenMenu = () => {
    setIsNavbarVisible(true);
  };

  return (
    <GoogleOAuthProvider clientId="531316774585-thhst1sop72gu9o3ib3kur6f0nmep4j5.apps.googleusercontent.com">
      <div className={styles.body}>
        {!isNavbarVisible && (
          <FaBars className={styles.bars} onClick={handleOpenMenu} />
        )}
        <Provider store={store}>
          <Router>
            <div className={styles.nav}>
              {isNavbarVisible && (
                <Navbar
                  notifications={notifications}
                  onclose={() => setIsNavbarVisible(false)}
                />
              )}
            </div>

            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post/:id" element={<PostComponent />} />
              <Route path="/perfil/:username" element={<Perfil />} />
              <Route
                path="/notifications"
                element={<Notifications notification={notifications} />}
              />
            </Routes>
          </Router>
        </Provider>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

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

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      const diff = Math.abs(newHeight - windowHeight);

      // Verifica se a diferença na altura é típica de abertura do teclado (geralmente entre 150-200px)
      if (diff > 150 && diff < 200) {
        setIsKeyboardOpen(true);
        return; // Ignora o evento de resize enquanto o teclado estiver aberto
      } else {
        setIsKeyboardOpen(false);
      }

      // Verifica se o tamanho da janela é menor que 768px e se o teclado não está aberto
      if (newHeight < windowHeight && !isKeyboardOpen) {
        if (window.innerWidth < 768) {
          setIsNavbarVisible(false);
        }
      } else {
        setIsNavbarVisible(true);
      }

      setWindowHeight(newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowHeight, isKeyboardOpen]);

  const handleOpenMenu = () => {
    setIsNavbarVisible(true);
  };

  return (
    <GoogleOAuthProvider clientId="531316774585-thhst1sop72gu9o3ib3kur6f0nmep4j5.apps.googleusercontent.com">
      <div className={styles.body}>
        {isNavbarVisible === false ? (
          <FaBars className={styles.bars} onClick={handleOpenMenu} />
        ) : null}
        <Provider store={store}>
          <Router>
            <div className={styles.nav}>
              {isNavbarVisible && (
                <Navbar onclose={() => setIsNavbarVisible(false)} />
              )}
            </div>

            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post/:id" element={<PostComponent />} />
              <Route path="/perfil/:username" element={<Perfil />} />
            </Routes>
          </Router>
        </Provider>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

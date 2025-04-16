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
import { useEffect, useRef, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastWindowHeight = useRef(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;

      // Se a altura caiu significativamente, provavelmente é o teclado
      if (lastWindowHeight.current - currentHeight > 150) {
        console.log("Teclado provavelmente abriu — ignorando resize");
        return;
      }

      if (window.innerWidth < 768) {
        setIsNavbarVisible(false);
        console.log("Navbar oculta");
      } else {
        setIsNavbarVisible(true);
        console.log("Navbar visível");
      }

      // Atualiza a altura
      lastWindowHeight.current = currentHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // chama uma vez no início

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenMenu = () => {
    setIsNavbarVisible(true);
  };

  return (
    <>
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
        </div>{" "}
      </GoogleOAuthProvider>
    </>
  );
}

export default App;

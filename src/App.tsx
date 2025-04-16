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
    console.log(innerHeight);
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      console.log("last.current: ", lastWindowHeight.current);
      console.log("last: ", lastWindowHeight);
      console.log("abri o teclado");
      console.log("current: ", currentHeight);

      // Se a altura caiu significativamente, provavelmente é o teclado
      if (
        lastWindowHeight.current > currentHeight ||
        lastWindowHeight.current === currentHeight ||
        lastWindowHeight.current < currentHeight
      ) {
        return console.log("Teclado provavelmente abriu — ignorando resize");
      }

      if (window.innerWidth < 768) {
        console.log("Navbar oculta");
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      // Atualiza a altura
      lastWindowHeight.current = currentHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // chama uma vez no início

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);

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

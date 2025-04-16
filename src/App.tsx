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
  const [windowHeight] = useState(window.innerHeight);

  useEffect(() => {
    let timeout: number;

    const handleResize = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const currentHeight = window.innerHeight;
        const diff = Math.abs(currentHeight - windowHeight);

        console.log(
          `windowHeight: ${windowHeight}, innerHeight: ${currentHeight}, diff: ${diff}`
        );

        if (diff > 10 && diff < 100) {
          console.log("Teclado provavelmente aberto, não fecha navbar");
          return;
        }

        if (window.innerWidth < 768) {
          console.log("Fechando navbar (não foi teclado)");
          setIsNavbarVisible(false);
        } else {
          setIsNavbarVisible(true);
        }
      }, 200); // espera 200ms pra garantir que a oscilação pare
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [windowHeight]);

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

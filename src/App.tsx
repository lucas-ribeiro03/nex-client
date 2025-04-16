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
    console.log(windowHeight);
    console.log(window.innerHeight);
    console.log(window.innerHeight - windowHeight);
    if (window.innerHeight - windowHeight > 50) {
      return console.log(
        `inner menos window é menor que 50 ainda, ${window.innerHeight} ${windowHeight}`
      );
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        console.log(
          `entrou no evento pra fechar a navbar window: ${windowHeight}, inner: ${window.innerHeight}`
        );
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

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

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

function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenMenu = () => {
    setIsNavbarVisible(true);
  };

  return (
    <>
      <div className={styles.body}>
        {isNavbarVisible === false ? (
          <FaBars className={styles.bars} onClick={handleOpenMenu} />
        ) : null}
        <Provider store={store}>
          <Router>
            <div className={styles.nav}>{isNavbarVisible && <Navbar />}</div>

            <Routes>
              <Route path="" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post/:id" element={<PostComponent />} />
              <Route path="/perfil/:username" element={<Perfil />} />
            </Routes>
          </Router>
        </Provider>
      </div>
    </>
  );
}

export default App;

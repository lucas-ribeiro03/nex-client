import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import styles from "./styles/global.module.scss";
import { Home } from "./Components/Home/Home";
import { Navbar } from "./Components/Navbar/Navbar";
import { Login } from "./Components/Login/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PostComponent } from "./Components/Post/PostComponent";
import { Perfil } from "./Components/Perfil/Perfil";

function App() {
  return (
    <>
      <div className={styles.body}>
        <Provider store={store}>
          <Router>
            <Navbar />
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

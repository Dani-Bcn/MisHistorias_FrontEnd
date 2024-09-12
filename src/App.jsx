import "./App.css";
import Cookies from "js-cookie";
import {
  Route,
  BrowserRouter,
  Routes,
  useNavigate,
  HashRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Navbar";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
import UserProfile from "./pages/Profile";
import CreateBook from "./pages/CreateBook";
import AllBooks from "./pages/AllBooks";
import { useEffect, useState } from "react";
import PageBook from "./pages/PageBook";
import WritingPage from "./pages/WritingPage";
import EditBook from "./pages/EditBook";
import ReadBook from "./pages/ReadBook";
import EditUser from "./pages/EditUser";
import WritingComments from "./pages/WritingComments";
import ReadComments from "./pages/ReadComments";

function App() {
  const [acces, setAcces] = useState();
  useEffect(() => {
    setAcces(localStorage.getItem("token"));
  }, []);

  return (
    <main className="absolute">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/createBook" element={<CreateBook />} />
        <Route path="/allBooks" element={<AllBooks />} />
        <Route path="/PageBook" element={<PageBook />} />
        <Route path="/editBook" element={<EditBook />} />
        <Route path="/writingPage" element={<WritingPage />} />
        <Route path="/readBook" element={<ReadBook />} />
        <Route path="/editUser" element={<EditUser />} />
        <Route path="writingComments" element={<WritingComments />} />
        <Route path="readComments" element={<ReadComments />} />
      </Routes>
    </main>
  );
}

export default App;

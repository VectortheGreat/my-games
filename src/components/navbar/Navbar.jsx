import { useLocation, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { modalFunc } from "../../redux/modalSlice";
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { authFBConfig } from "../../config/firebaseConfig";
import { logoutFunc } from "../../redux/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryPathname = location.pathname.split("/")[1];
  const queryPathname2 = location.pathname.split("/")[3];
  const token = useSelector((state) => state.auth.token);
  const auth = authFBConfig;

  const handleLogout = () => {
    if (token) {
      signOut(auth)
        .then(() => {
          console.log("Signed out successfully");
        })
        .catch((error) => {
          console.error(error);
        });
      dispatch(logoutFunc());
      navigate("/auth");
    } else {
      console.error("User is not authenticated. Cannot sign out.");
    }
  };

  const openModal = () => {
    dispatch(modalFunc());
    navigate("?create=true");
  };
  return (
    <nav className="mygames-navbar-bg p-4 text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="md:text-xl text-xs font-bold cursor-pointer" onClick={() => navigate("/")}>
            My Games
          </div>
          <ul className="flex space-x-5 items-center">
            <li
              className={`md:text-lg text-xs hover:rounded-md cursor-pointer hover:text-sky-800 duration-300 ${
                queryPathname === "users" ? "border-b-2 border-white" : ""
              }`}
              onClick={() => navigate("/users")}
            >
              Üyeler
            </li>
            {token && (
              <li
                className={`md:text-lg text-xs hover:rounded-md cursor-pointer hover:text-sky-800 duration-300 ${
                  queryPathname === "user" ? "border-b-2 border-white" : ""
                }`}
                onClick={() => navigate(`/user/${JSON.parse(token).uid}`)}
              >
                Oyunlarım
              </li>
            )}
          </ul>
          <ul className="flex space-x-5 items-center">
            {token && queryPathname === "user" && queryPathname2 !== "game" && (
              <li className="text-lg hover:rounded-md hover:text-sky-800 duration-300">
                <CiCirclePlus
                  className="md:h-8 md:w-8 text-xs h-6 w-6 cursor-pointer"
                  onClick={openModal}
                ></CiCirclePlus>
              </li>
            )}
            {!token && (
              <li className="text-l hover:rounded-md hover:text-sky-800 duration-300">
                <FaRegUser
                  className="md:h-8 md:w-8 text-xs h-6 w-6 cursor-pointer"
                  onClick={() => navigate("/auth")}
                ></FaRegUser>
              </li>
            )}
            {token && (
              <li className="text-l hover:rounded-md hover:text-sky-800 duration-300">
                <CiLogout className="md:h-8 md:w-8 text-xs h-6 w-6 cursor-pointer" onClick={handleLogout}></CiLogout>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

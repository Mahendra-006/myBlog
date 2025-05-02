import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface JWTPayload {
  id: string;
  name: string;
}

export const Appbar = () => {
  const [userName, setUserName] = useState<string>("User");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUserName(decoded.name);
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem("token");
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="border-b flex justify-between items-center px-6 py-4 bg-white text-black">
      <Link to="/blogs">
        <div className="text-lg font-bold cursor-pointer">MyBlog</div>
      </Link>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          Hi, {userName}
        </span>
        <Link to="/publish">
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
            New
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-full text-sm font-medium"
        >
          Logout
        </button>
        <Avatar name={userName} />
      </div>
    </div>
  );
};

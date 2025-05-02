import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        { title, content },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black">
              Title
            </label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              id="title"
              placeholder="Title goes here"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-black">
              Content
            </label>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              id="content"
              rows={6}
              placeholder="Write your thoughts here..."
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-gray-200 px-4 py-3 text-black font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

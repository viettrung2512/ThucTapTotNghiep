import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import NavBar from "../../../components/Header/NavBar";
import SideBar from "../../../components/Sidebar/SideBar";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập để xem lịch sử.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.text();
          console.error("Error Response:", data); // Log lỗi chi tiết
          throw new Error(data || "Lỗi khi tải lịch sử.");
        }

        const data = await response.json();
        setHistory(data.data.history);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);


  if (loading) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <header>
        <NavBar />
      </header>
      <main className="flex">
        <div className="w-60">
          <SideBar />
        </div>
        <div className="flex-grow p-4 ml-4">
          <h2 className="text-lg font-semibold mb-5 mt-20">Lịch sử đọc</h2>
          <div className="mt-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item._id} className="border-b border-gray-700 mb-4 pb-2">
                  <div className="flex items-center">
                    <img
                      src={item.details?.postId?.imageCloudUrl || ""}
                      alt="Article Thumbnail"
                      className="w-20 h-20 rounded-lg mr-2"
                    />
                    <div>
                      <Link to={`/blog/${item.details?.postId?._id}`}>
                        <h3 className="text-md font-medium text-blue-400 hover:underline">
                          {item.details?.postId?.title || "Bài viết không tồn tại"}
                        </h3>
                      </Link>
                      <span className="text-sm text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Không có lịch sử đọc nào.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const HistoryItem = ({ history }) => (
  <div className="border-b border-gray-700 mb-4 pb-2">
    <div className="flex items-center">
      <img
        src={history.details?.postId?.imageCloudUrl || ""}
        alt="Article Thumbnail"
        className="w-20 h-20 rounded-lg mr-2"
      />
      <div>
        <Link to={`/blog/${history.details?.postId?._id}`}>
          <h3 className="text-md font-medium text-blue-400 hover:underline">
            {history.details?.postId?.title || "Bài viết không tồn tại"}
          </h3>
        </Link>
        <span className="text-sm text-gray-400">
          {new Date(history.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

HistoryItem.propTypes = {
  history: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    details: PropTypes.shape({
      postId: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        imageCloudUrl: PropTypes.string,
      }), 
    }),
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default HistoryPage;



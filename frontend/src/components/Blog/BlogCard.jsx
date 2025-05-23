import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BlogCard = ({ blog, category, title, imageUrl }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/blog/${blog._id}`); 
  };

  
  return (
    <div
      onClick={handleNavigation}
      className="border border-gray-100 rounded-lg overflow-hidden w-72 m-2 hover:shadow-xl hover:scale-[1.02] transition transform duration-300 cursor-pointer"
    >
      <img src={imageUrl} alt={title} className="w-full h-44 object-cover" />
      <div className="p-2">
        <p className="text-xs text-gray-500">{category}</p>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
    </div>
  );
};
BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default BlogCard;

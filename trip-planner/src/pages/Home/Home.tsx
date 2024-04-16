import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const onExploreClick = () => {
    if (isAuthenticated) {
      navigate(Paths.TRIPS);
      return;
    }

    navigate(Paths.LOGIN);
  }

  return (
    <div
      className="h-screen flex justify-center items-center"
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6">
          Embark on Your Journey: Capture, Share, Explore!
        </h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full shadow-lg text-lg font-semibold transition duration-300" onClick={() => onExploreClick()}>
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default Home;

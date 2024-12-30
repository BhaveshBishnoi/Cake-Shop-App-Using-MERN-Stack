import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CakeCard = ({ data }) => {
  return (
    <>
      <Link to={`/get-cake-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-3">
          <div>
            <img
              className="h-auto max-w-full rounded-lg"
              src={data.url}
              alt="Shop"
            />
          </div>
          <h1 className="text-xl font-medium pt-1">{data.title}</h1>
          <p className="text-gray-500 py-1">
            {data.description.slice(0, 50)}...
          </p>
          <h2> ₹ {data.price}</h2>
        </div>
      </Link>
    </>
  );
};

CakeCard.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    price: PropTypes.number,
    _id: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default CakeCard;

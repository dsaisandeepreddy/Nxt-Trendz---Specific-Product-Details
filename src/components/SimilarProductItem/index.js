// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {eachData} = props
  const {
    brand,
    id,
    imageUrl,
    price,
    rating,

    title,
  } = eachData
  return (
    <div>
      <img
        className="image-data"
        src={imageUrl}
        alt={`similar product${title}`}
      />
      <h1>{title}</h1>
      <p>by{brand}</p>
      <div>
        <p>Rs {price}</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </div>
  )
}

export default SimilarProductItem

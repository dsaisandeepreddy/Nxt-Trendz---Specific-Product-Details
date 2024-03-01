// Write your code here
import {Component} from 'react'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    eachProductTitle: [],
    plusData: 1,
    apiStatus: apiStatusConstants.initial,
    showSubmitError: false,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductsData()
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      plusData: prevState.plusData + 1,
    }))
  }

  onClickMinus = () => {
    this.setState(prevState => ({
      plusData: prevState.plusData - 1,
    }))
  }

  getProductsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const apiurl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiurl, options)

    const dataOne = await response.json()

    if (response.ok === true) {
      const updatedData = dataOne.similar_products.map(eachProduct => ({
        availability: eachProduct.availability,
        brand: eachProduct.brand,
        description: eachProduct.description,
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        price: eachProduct.price,
        rating: eachProduct.rating,
        style: eachProduct.style,
        title: eachProduct.title,
        totalReviews: eachProduct.total_reviews,
      }))
      this.setState({
        eachProductTitle: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        showSubmitError: true,
        errorMsg: dataOne.error_msg,
      })
    }
  }

  renderSuccessView = () => {
    const {eachProductTitle, plusData} = this.state

    return (
      <div>
        <div>
          <Header />

          <button data-testid="minus" type="button" onClick={this.onClickMinus}>
            <BsDashSquare />{' '}
          </button>

          <p>{plusData}</p>
          <button data-testid="plus" type="button" onClick={this.onClickPlus}>
            <BsPlusSquare />{' '}
          </button>
        </div>
        <button type="button">ADD TO CART</button>

        <div>
          <h1>SImIlar Products</h1>
          {eachProductTitle.map(eachData => (
            <SimilarProductItem eachData={eachData} key={eachData.id} />
          ))}
        </div>
      </div>
    )
  }

  onFailureView = () => {
    const {errorMsg} = this.state
    return (
      <>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="image-data"
        />
        <p>{errorMsg}</p>
        <Link to="/products">
          <button type="button">Continue Shopping</button>
        </Link>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.onFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails

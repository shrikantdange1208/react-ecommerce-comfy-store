import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.products.map((product) => product.price)
      maxPrice = Math.max(...maxPrice)
      return {
        ...state,
        all_products: [...action.payload.products],
        filtered_products: [...action.payload.products],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      }

    case SET_GRIDVIEW:
      return { ...state, grid_view: true }

    case SET_LISTVIEW:
      return { ...state, grid_view: false }

    case UPDATE_SORT:
      return { ...state, sort: action.payload.sort }

    case SORT_PRODUCTS:
      const { sort, filtered_products } = state
      let tempProducts = [...filtered_products]
      if (sort === 'price-lowest') {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price)
      }

      if (sort === 'price-highest') {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price)
      }

      if (sort === 'name-a') {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }

      if (sort === 'name-z') {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name)
        })
      }
      return { ...state, filtered_products: tempProducts }

    case UPDATE_FILTERS:
      const { name, value } = action.payload
      return { ...state, filters: { ...state.filters, [name]: value } }

    case FILTER_PRODUCTS:
      const { all_products } = state
      const { text, category, company, color, price, shipping } = state.filters

      let intermediateProducts = [...all_products]

      if (text) {
        intermediateProducts = intermediateProducts.filter((product) => {
          return product.name.toLowerCase().startsWith(text.toLowerCase())
        })
      }

      if (category !== 'all') {
        intermediateProducts = intermediateProducts.filter((product) => {
          return product.category === category
        })
      }

      if (company !== 'all') {
        intermediateProducts = intermediateProducts.filter((product) => {
          return product.company === company
        })
      }

      if (shipping) {
        intermediateProducts = intermediateProducts.filter((product) => {
          return product.shipping === true
        })
      }

      if (color !== 'all') {
        intermediateProducts = intermediateProducts.filter((product) => {
          return product.colors.find((curr) => curr === color)
        })
      }

      intermediateProducts = intermediateProducts.filter((product) => {
        return product.price <= price
      })

      return { ...state, filtered_products: intermediateProducts }

    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: '',
          company: 'all',
          category: 'all',
          color: 'all',
          price: state.filters.max_price,
          shipping: false,
        },
      }
    default:
      throw new Error(`No matching "${action.type}" - action type`)
  }
}

export default filter_reducer

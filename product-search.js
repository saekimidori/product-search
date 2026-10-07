let products = []
let productsToShow = 12
let favorites = JSON.parse(localStorage.getItem('favorites')) || []
let lastFocusedElement

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const clearSearchButton = document.querySelector('#clear-search')
const categorySelect = document.querySelector('#category-select')
const sortSelect = document.querySelector('#sort-select')
const productResults = document.querySelector('#product-results')
const loadMoreButton = document.querySelector('#load-more')
const productCount = document.querySelector('#product-count')
const productModal = document.querySelector('#product-modal')
const productDetails = document.querySelector('#product-details')
const closeModal = document.querySelector('#close-modal')
const urlParams = new URLSearchParams(window.location.search)

const savedSearch = urlParams.get('search')
const savedCategory = urlParams.get('category')
const savedSort = urlParams.get('sort')
const savedLimit = urlParams.get('limit')

if (savedSearch) {
    searchInput.value = savedSearch
}

if (savedLimit) {
    const parsedLimit = Number(savedLimit)

    if (parsedLimit >= 12 && parsedLimit % 12 === 0) {
        productsToShow = parsedLimit
    }
}

fetch('https://dummyjson.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        
        return response.json()
    })
    .then(data => {
        products = data.products
        createCategoryOptions()

        if (savedCategory) {
            const categoryExists = [...categorySelect.options]
                .some(option => option.value === savedCategory)

            if (categoryExists) {
                categorySelect.value = savedCategory
            }
        }

        if (savedSort) {
            const sortExists = [...sortSelect.options]
                .some(option => option.value === savedSort)

            if (sortExists) {
                sortSelect.value = savedSort
            }
        }

        filterProducts()
    })
    .catch(error => {
        productResults.innerHTML =
            '<p>Unable to load products. Please try again later.</p>'

        console.error(error)
    })

function createCategoryOptions() {
    const categories = []

    products.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category)
        }
    })

    categories.forEach(category => {
        const option = document.createElement('option')

        option.value = category
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1)

        categorySelect.appendChild(option)
    })
}

function displayProducts(productsToDisplay) {
    productResults.innerHTML = ''

    const visibleProducts = productsToDisplay.slice(0, productsToShow)

    if (productsToDisplay.length === 0) {
        productResults.innerHTML = '<p>No products found.</p>'
        loadMoreButton.style.display = 'none'
        return
    }

    visibleProducts.forEach(product => {
        const productCard = document.createElement('article')

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p class="category">${product.category}</p>
            <p class="rating">Rating: ${product.rating}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="card-actions">
                <button
                    class="view-details"
                    type="button"
                    aria-label="View details for ${product.title}"
                >
                    View Details
                </button>
                <button class="favorite-button" type="button">
                    ♡ Add to Favorites
                </button>
            </div>
        `

        const viewDetailsButton = productCard.querySelector('.view-details')
        const favoriteButton = productCard.querySelector('.favorite-button')

        if (favorites.includes(product.id)) {
            favoriteButton.textContent = '♥ Remove from Favorites'
            favoriteButton.setAttribute(
                'aria-label',
                `Remove ${product.title} from favorites`
            )
        } else {
            favoriteButton.textContent = '♡ Add to Favorites'
            favoriteButton.setAttribute(
                'aria-label',
                `Add ${product.title} to favorites`
            )
        }

        viewDetailsButton.addEventListener('click', function() {
            showProductDetails(product)
        })

        favoriteButton.addEventListener('click', function() {
            toggleFavorite(product)
        })

        productResults.appendChild(productCard)
    })

    const visibleCount = Math.min(
        productsToShow,
        productsToDisplay.length
    )

    productCount.textContent =
        `Showing ${visibleCount} of ${productsToDisplay.length}`

    if (productsToShow >= productsToDisplay.length) {
        loadMoreButton.style.display = 'none'
    } else {
        loadMoreButton.style.display = 'block'
    }
}

function showProductDetails(product) {
    lastFocusedElement = document.activeElement

    productDetails.innerHTML = `
        <img src="${product.images[0]}" alt="${product.title}">
        <h2 id="modal-title" class="modal-title">${product.title}</h2>
        <p class="modal-price">$${product.price.toFixed(2)}</p>
        <p class="modal-rating">Rating: ${product.rating}</p>
        <p class="modal-description">${product.description}</p>
        <p class="modal-category">Category: ${product.category}</p>
        <p class="modal-stock">In stock: ${product.stock}</p>
    `
    productModal.showModal()
}

function toggleFavorite(product) {
    if (favorites.includes(product.id)) {
        favorites = favorites.filter(id => id !== product.id)
    } else {
        favorites.push(product.id)
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))

    filterProducts()
}

closeModal.addEventListener('click', function() {
    productModal.close()
})

productModal.addEventListener('click', function(event) {
    if (event.target === productModal) {
        productModal.close()
    }
})

function filterProducts(resetLimit = true) {
    if (resetLimit) {
        productsToShow = 12
    }

    const searchTerm = searchInput.value.toLowerCase()
    const selectedCategory = categorySelect.value
    const selectedSort = sortSelect.value

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchTerm)

        const matchesCategory =
            selectedCategory === 'all' ||
            (selectedCategory === 'favorites' &&
                favorites.includes(product.id)) ||
            product.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    switch (selectedSort) {
    case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price)
        break

    case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price)
        break

    case 'rating-high':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break

    case 'rating-low':
        filteredProducts.sort((a, b) => a.rating - b.rating)
        break
    }

    displayProducts(filteredProducts)
}

searchForm.addEventListener('submit', function(event) {
    event.preventDefault()
    filterProducts()
    updateURL()
})

searchInput.addEventListener('input', function() {
    filterProducts()
    updateURL()
})

clearSearchButton.addEventListener('click', function() {
    searchInput.value = ''
    filterProducts()
    updateURL()
})

searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        searchInput.value = ''
        displayProducts(products)
    }
})

categorySelect.addEventListener('change', function() {
    filterProducts()
    updateURL()
})

sortSelect.addEventListener('change', function() {
    filterProducts()
    updateURL()
})

loadMoreButton.addEventListener('click', function() {
    productsToShow += 12
    filterProducts(false)
    updateURL()
})

function updateURL() {
    const searchTerm = searchInput.value.trim()
    const selectedCategory = categorySelect.value
    const selectedSort = sortSelect.value

    const params = new URLSearchParams()

    if (searchTerm) {
        params.set('search', searchTerm)
    }

    if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory)
    }

    if (selectedSort && selectedSort !== 'default') {
        params.set('sort', selectedSort)
    }

    if (productsToShow > 12) {
        params.set('limit', productsToShow)
    }

    const queryString = params.toString()

    const newURL = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname

    window.history.replaceState({}, '', newURL)
}
let products = []

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const categorySelect = document.querySelector('#category-select')
const sortSelect = document.querySelector('#sort-select')
const productResults = document.querySelector('#product-results')

fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {

        products = data.products
        createCategoryOptions()
        displayProducts(products)

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

    if (productsToDisplay.length === 0) {
        productResults.innerHTML = '<p>No products found.</p>'
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('article')

        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price}</p>
        `

        productResults.appendChild(productCard)
    })
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedCategory = categorySelect.value
    const selectedSort = sortSelect.value

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.title
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory =
            selectedCategory === 'all' ||
            product.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    if (selectedSort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price)
    }

    if (selectedSort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price)
    }

    displayProducts(filteredProducts)
}

searchForm.addEventListener('submit', function(event) {
    event.preventDefault()
    filterProducts()
})

categorySelect.addEventListener('change', function() {
    filterProducts()
})

sortSelect.addEventListener('change', function() {
    filterProducts()
})
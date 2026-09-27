let products = []

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const productResults = document.querySelector('#product-results')

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {

        products = data;

        displayProducts(products);

    })
    .catch(error => {

        productResults.innerHTML =
            '<p>Unable to load products. Please try again later.</p>';

        console.error(error);
    })

function displayProducts(productsToDisplay) {

    productResults.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productResults.innerHTML = '<p>No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {

        const productCard = document.createElement('article');

        productCard.innerHTML = `
            <h2>${product.title}</h2>
            <p>$${product.price}</p>
            <img src="${product.image}" alt="${product.title}">
        `;

        productResults.appendChild(productCard);
    })
}

searchForm.addEventListener('submit', function(event) {

    event.preventDefault();

    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);

})
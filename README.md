# Product Search

A responsive product-search application built with HTML, CSS, and JavaScript using the DummyJSON Products API.

The application allows users to search, filter, sort, and browse products while providing additional features such as favorites, product details, and URL-based search state.

## Live Demo

[View the live application](https://saekimidori.github.io/product-search/)

## Features

* Fetches product data from the DummyJSON Products API
* Search products by name
* Filter products by category
* Filter products by favorites
* Sort products by:
  * Price: Low to High
  * Price: High to Low
  * Rating: High to Low
  * Rating: Low to High
* Load additional products in batches
* Displays the number of products currently shown
* Save favorite products using `localStorage`
* View detailed product information in a modal
* Close the modal using:
  * Close button
  * Clicking outside the modal
  * Escape key
* Keyboard-accessible modal interactions
* Preserves search, category, sort, and Load More state in the URL
* Responsive product-card layout
* Handles API and no-results errors

## Technologies

* HTML5
* CSS3
* JavaScript
* DummyJSON API

## How It Works

When the application loads, JavaScript requests product data from the DummyJSON API.

The returned products are stored in an array and displayed as product cards. Users can then interact with the products through search, category filtering, sorting, and favorites.

The application updates the displayed products based on the user's selections without requiring the page to reload.

Search, category, sorting, and Load More settings can also be stored in the URL. This allows the current search state to be preserved when the page is refreshed or the URL is shared.

Favorites are stored in the browser using `localStorage`, allowing them to remain available after the page is refreshed.

## API

Product data is retrieved from the DummyJSON Products API.

## Future Improvements

* Add more detailed product filtering
* Add clear filters button
* Add loading state
* Add additional accessibility improvements
* Add automated testing
* Improve mobile navigation and controls
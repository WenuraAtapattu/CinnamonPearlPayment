document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartTableBody = document.querySelector('#cart-table tbody');
    const proceedToPayButton = document.querySelector('#proceed-to-pay');

    // Function to save cart data to localStorage to be used in Order Page
    function saveCartToLocalStorage() {
        const cartData = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const productName = row.cells[0].innerText;
            const productPrice = row.cells[1].innerText;
            const productQuantity = row.cells[2].innerText;
            const productTotal = row.cells[3].innerText;
            cartData.push({ productName, productPrice, productQuantity, productTotal });
        });
        localStorage.setItem('cartData', JSON.stringify(cartData));
    }

    //Add to Cart Button Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            //Getting all the required variables
            const card = this.closest('.card');
            const productName = card.querySelector('.product-text h2').innerText;
            const productPrice = parseFloat(card.querySelector('.price').innerText.replace('LKR', ''));
            const quantityInput = card.querySelector('.quantity input');
            const productQuantity = parseFloat(quantityInput.value);

            //Checking if the quantity is greater than zero
            if (isNaN(productQuantity) || productQuantity <= 0) {
                alert('Please enter a valid quantity');
                return;
            }

            const existingRow = Array.from(cartTableBody.rows).find(row => row.cells[0].innerText === productName);

            if (existingRow) {
                //Calculating Total
                const existingQuantity = parseFloat(existingRow.cells[2].innerText);
                const newQuantity = existingQuantity + productQuantity;
                const newTotal = productPrice * newQuantity;

                existingRow.cells[2].innerText = newQuantity;
                existingRow.cells[3].innerText = newTotal.toFixed(2) + ' LKR';
            } else {
                const newRow = cartTableBody.insertRow();
                newRow.insertCell(0).innerText = productName;
                newRow.insertCell(1).innerText = productPrice.toFixed(2) + ' LKR';
                newRow.insertCell(2).innerText = productQuantity;
                newRow.insertCell(3).innerText = (productPrice * productQuantity).toFixed(2) + ' LKR';
                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', function() {
                    newRow.remove();
                    saveCartToLocalStorage();
                });
                newRow.insertCell(4).appendChild(removeButton);
            }

            quantityInput.value = ''; // Clear input field
            saveCartToLocalStorage();
        });
    });

    proceedToPayButton.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = './order.html';  // Redirect to order page
    });
});

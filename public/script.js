document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const prodUrl = document.getElementById('productUrl').value;
    document.getElementById('status').textContent = 'Checking Availability....';

    try {
        const response = await fetch('http://localhost:3000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: prodUrl })
        });

        const result = await response.json();

        if (result.inStock) {
            document.getElementById('status').textContent = 'Product is in stock!';
            console.log('In stock');
        } else {
            document.getElementById('status').textContent = 'Product is out of stock!';
            console.log('Not in stock');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'An error occurred. Please try again.';
    }
});

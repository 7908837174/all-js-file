const CONVENIENCE_FEES = 99;
let bagItemsObjects = [];

onLoad();

function onLoad() {
    loadBagItemObjects();
    displayBagItem();
    displayBagSummary();
}

function loadBagItemObjects() {
    let bagItemsStr = localStorage.getItem('bagItems');
    bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
    bagItemsObjects = bagItems.map(itemName => {
        return items.find(item => item.item_name === itemName);
    });
}

function displayBagItem() {
    let containerElement = document.querySelector('.bag-items-container');
    let innerHTML = '';
    bagItemsObjects.forEach(bagItem => {
        innerHTML += generateItemHTML(bagItem);
    });
    containerElement.innerHTML = innerHTML;
}

function generateItemHTML(item) {
    return `
        <div class="bag-item-container">
            <div class="item-left-part">
                <img class="bag-item-img" src="${item.item_image}" alt="${item.item_name}">
            </div>
            <div class="item-right-part">
                <div class="company">${item.company_name}</div>
                <div class="item-name">${item.item_name}</div>
                <div class="price-container">
                    <span class="current-price">$${item.current_price}</span>
                    <span class="original-price">$${item.original_price}</span>
                    <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
                </div>
                <div class="delivery-details">
                    Delivery by <span class="delivery-details-days">${item.delivery_date}</span>
                </div>
            </div>
            <div class="remove-from-cart" onclick="removeFromBag('${item.item_name}')">X</div>
        </div>
    `;
}

function removeFromBag(itemName) {
    bagItems = bagItems.filter(bagItemName => bagItemName !== itemName);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    loadBagItemObjects();
    displayBagItem();
    displayBagSummary();
}

function displayBagSummary() {
    let bagSummaryElement = document.querySelector('.bag_summary');
    let totalItem = bagItemsObjects.length;
    let totalMRP = 0;
    let totalDiscount = 0;

    bagItemsObjects.forEach(bagItem => {
        totalMRP += bagItem.original_price;
        totalDiscount += (bagItem.original_price - bagItem.current_price);
    });

    let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;
    bagSummaryElement.innerHTML = `
        <div class="bag-details-container">
            <div class="price-header">PRICE DETAILS (${totalItem} Items)</div>
            <div class="price-item">
                <span class="price-item-tag">Total MRP</span>
                <span class="price-item-value">$${totalMRP}</span>
            </div>
            <div class="price-item">
                <span class="price-item-tag">Discount on MRP</span>
                <span class="price-item-value priceDetail-base-discount">-$${totalDiscount}</span>
            </div>
            <div class="price-item">
                <span class="price-item-tag">Convenience Fee</span>
                <span class="price-item-value">$${CONVENIENCE_FEES}</span>
            </div>
            <hr>
            <div class="price-footer">
                <span class="price-item-tag">Total Amount</span>
                <span class="price-item-value">$${finalPayment}</span>
            </div>
        </div>
        <button class="btn-place-order">
            <div class="css-xjhrni">PLACE ORDER</div>
        </button>
    `;
}

import { hideModalIcon } from './modal/modal';

const freeDelivery = 600;
const deliveryCost = 100;
const basketItems = {};

let totalGoods = 0;
let totalCostGlobal = 0;
let wrapperSeparateGoodsMinus, wrapperSeparateGoodsPlus;
let counter = 0;

function createItem(img_src, name, weight, price) {
    const quantityGoods = +document.querySelector('.goods__total').textContent;

    if (document.querySelector('.basket__goods').childElementCount === 0) {
        document.querySelector('.basket__goods').classList.add('basket__goods-border');
        document.querySelector('.basket__goods + div').classList.remove('basket__order-hide');
        document.querySelector('.basket__goods + div').classList.add('basket__order-show');
    }

    if (basketItems.hasOwnProperty(name)) {
        basketItems[name][0] += quantityGoods;
        totalGoods += quantityGoods;
        document.querySelector('.basket__total').textContent = totalGoods;
        return;
    }

    basketItems[name] = [quantityGoods, +price.slice(0, -1)];
    const sizeBasketItems = counter++;

    const message = document.createElement('p');
    message.classList.add('p', 'in-basket');
    message.textContent = 'У кошику';

    if (basketItems.hasOwnProperty(name)) {
        if (document.querySelector('.in-basket')) {
            document.querySelector('.goods__add').style.display = 'none';
            document.querySelector('.in-basket').style.display = 'block';
        } else {
            document.querySelector('.goods__add').style.display = 'none';
            document.querySelector('.model__add').prepend(message);
        }
    }

    const item = document.createElement('div');
    const blockDescription = document.createElement('div');
    const basketText = document.createElement('div');
    const imgItem = document.createElement('img');
    const nameItem = document.createElement('p');
    const weightItem = document.createElement('p');
    const priceItem = document.createElement('p');

    item.classList.add('basket__item');
    blockDescription.classList.add('basket__item-desc');
    nameItem.classList.add('p', 'basket__item-name');
    weightItem.classList.add('p', 'basket__item-weight');
    priceItem.classList.add('p', 'basket__item-price');

    imgItem.src = img_src;
    imgItem.style.width = '64px';
    imgItem.style.borderRadius = '8px';
    nameItem.textContent = name;
    weightItem.textContent = `${weight}г`;
    priceItem.textContent = price;

    basketText.append(nameItem);
    basketText.append(weightItem);
    basketText.append(priceItem);
    blockDescription.append(imgItem);
    blockDescription.append(basketText);

    item.append(blockDescription);
    item.append(createCounter(sizeBasketItems, quantityGoods));
    document.querySelector('.basket__goods').append(item);

    calcSeparateGoodsBasket(`.basket__minus-${sizeBasketItems}`, `.basket__plus-${sizeBasketItems}`, `.basket__total-${sizeBasketItems}`, name);

    totalGoods += quantityGoods;
    document.querySelector('.basket__total').textContent = totalGoods;
    calcPriceGoods();
    hideModalIcon();
}

function createCounter(sizeBasketItems, quantityGoods) {
    const goodsCounter = document.createElement('div');
    const goodsMinus = document.createElement('span');
    const goodsTotal = document.createElement('span');
    const goodsPlus = document.createElement('span');

    goodsCounter.classList.add('basket__counter-general', `basket__counter-${sizeBasketItems}`);
    goodsMinus.classList.add(`basket__minus-${sizeBasketItems}`);
    goodsTotal.classList.add(`basket__total-${sizeBasketItems}`);
    goodsPlus.classList.add(`basket__plus-${sizeBasketItems}`);

    goodsMinus.style.cursor = 'pointer';
    goodsPlus.style.cursor = 'pointer';

    goodsMinus.textContent = '-';
    goodsTotal.textContent = `${quantityGoods}`;
    goodsPlus.textContent = '+';

    goodsCounter.append(goodsMinus, goodsTotal, goodsPlus);

    return goodsCounter;
}

function calcSeparateGoodsBasket(firstSelector, secondSelector, thirdSelector, name) {
    const goodsMinus = document.querySelector(firstSelector);
    const goodsPlus = document.querySelector(secondSelector);

    wrapperSeparateGoodsMinus = () => separateGoodsMinus(thirdSelector, name);
    wrapperSeparateGoodsPlus = () => separateGoodsPlus(thirdSelector, name);

    goodsMinus.addEventListener('click', wrapperSeparateGoodsMinus);
    goodsPlus.addEventListener('click', wrapperSeparateGoodsPlus);
}

function separateGoodsMinus(selector, name) {
    const goodsTotal = document.querySelector(selector);
    let goodsSeparateNumber = +goodsTotal.textContent;
    const goodsMin = 0;

    if (goodsSeparateNumber > goodsMin) {
        goodsSeparateNumber--;
        totalGoods--;
        basketItems[name][0] -= 1;
        goodsTotal.textContent = goodsSeparateNumber;
        document.querySelector('.basket__total').textContent = totalGoods;
        calcPriceGoods();
    }

    if (basketItems[name][0] === 0) {
        delete basketItems[name];
        document.querySelectorAll('.basket__item').forEach(item => {
            if (item.querySelector('.basket__item-name').textContent === name) item.remove();
        });
    }

    if (totalGoods === 0) {
        document.querySelector('.basket__goods').classList.remove('basket__goods-border');
        document.querySelector('.basket__goods + div').classList.remove('basket__order-show');
        document.querySelector('.basket__goods + div').classList.add('basket__order-hide');
        document.querySelector('.basket').classList.remove('shadow');
        document.querySelector('.basket__details').classList.remove('open');
    }
}

function separateGoodsPlus(selector, name) {
    const goodsTotal = document.querySelector(selector);
    let goodsSeparateNumber = +goodsTotal.textContent;
    const goodsMax = 5;

    if (goodsSeparateNumber < goodsMax) {
        goodsSeparateNumber++;
        totalGoods++;
        basketItems[name][0] += 1;
        goodsTotal.textContent = goodsSeparateNumber;
        document.querySelector('.basket__total').textContent = totalGoods;
        calcPriceGoods();
    }
}

function calcPriceGoods() {
    const priceField = document.querySelector('.basket__order-price > .price_field');
    let totalCost = 0;

    for (let key in basketItems) {
        totalCost += basketItems[key][0] * basketItems[key][1];
    }

    totalCost += deliveryCost;

    if (totalCost - deliveryCost > freeDelivery) {
        totalCost -= deliveryCost;
        document.querySelector('.basket__details > div:last-child').classList.remove('basket__free-hide');
        document.querySelector('.basket__details > div:last-child').classList.add('basket__free-show');
        document.querySelector('.basket__order-wrapper > div:first-child').classList.remove('basket__order-price');
        document.querySelector('.basket__order-wrapper > div:first-child').classList.add('basket__order-delivery');
    } else {
        document.querySelector('.basket__details > div:last-child').classList.remove('basket__free-show');
        document.querySelector('.basket__details > div:last-child').classList.add('basket__free-hide');
        document.querySelector('.basket__order-wrapper > div:first-child').classList.add('basket__order-price');
        document.querySelector('.basket__order-wrapper > div:first-child').classList.remove('basket__order-delivery');
    }

    totalCostGlobal = totalCost;
    priceField.textContent = `${totalCost}₴`;
}

function resetBasketState() {
    totalGoods = 0;
    totalCostGlobal = 0;
    counter = 0;
}

export { freeDelivery, deliveryCost, basketItems, totalGoods, totalCostGlobal, counter, createItem, resetBasketState };
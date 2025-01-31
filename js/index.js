'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const strArray = ['Кількість', 'Ціна за одиницю'];
    const freeDelivery = 600;
    const deliveryCost = 100;
    const basketItems = {};

    let wrapperSeparateGoodsMinus, wrapperSeparateGoodsPlus;
    let totalCostGlobal = 0;
    let currentData = null;
    let totalGoods = 0;
    let handleFunction;
    let scrollY = 0;
    let counter = 0;
    
    document.querySelector('.hero_p').textContent = `Безкоштовна доставка від ${freeDelivery}₴`;

    // NAV LIST

    const getResource = async url => {
        const result = await fetch(url);

        if (result.status !== 200) {
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    const postData = async (url, data) => {
        const result = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        });

        return await result.json();
    }

    async function getNavList() {
        const data = await getResource('http://localhost:3000/nav');
        const list = document.querySelector('.nav');

        data.forEach((item, index) => {
            const { title, img } = item,
                listItem = document.createElement('button');

            listItem.classList.add('nav_item');
            listItem.setAttribute('data-nav-index', index);
            listItem.innerHTML = `<img src=${img}>${title}`;

            list.append(listItem);
        });
    }

    function showNavItem(navList, index = 0) {
        navList[index].classList.add('nav_item_active');
    }

    function hideNavItem(navList) {
        navList.forEach(item => {
            item.classList.remove('nav_item_active');
        });
    }

    function showModalIcon(modalSelector) {
        document.querySelector(modalSelector).style.display = 'block';
        scrollY = document.documentElement.scrollTop;
        document.body.style.cssText = `
            position: fixed;
            left: 0;
            top: -${scrollY}px;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
        `;
    }

    function hideModalIcon() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            document.body.style.cssText = '';
            document.documentElement.scrollTop = scrollY;
        });
    }

    // Button plus and minus goods

    function totalGoodsMinus() {
        const goodsTotal = document.querySelector('.goods__total');
        let goodsTotalNumber = +goodsTotal.textContent;
        const goodsMin = 1;
    
        if (goodsTotalNumber > goodsMin) {
            goodsTotalNumber--;
            goodsTotal.textContent = goodsTotalNumber;
        }
    }
    
    function totalGoodsPlus() {
        const goodsTotal = document.querySelector('.goods__total');
        let goodsTotalNumber = +goodsTotal.textContent;
        const goodsMax = 5;
    
        if (goodsTotalNumber < goodsMax) {
            goodsTotalNumber++;
            goodsTotal.textContent = goodsTotalNumber;
        }
    }
    
    function calcTotalGoods() {
        const goodsMinus = document.querySelector('.goods__minus');
        const goodsPlus = document.querySelector('.goods__plus');
    
        goodsMinus.removeEventListener('click', totalGoodsMinus);
        goodsPlus.removeEventListener('click', totalGoodsPlus);
    
        goodsMinus.addEventListener('click', totalGoodsMinus);
        goodsPlus.addEventListener('click', totalGoodsPlus);
    }

    function calcPriceGoods() {
        const priceField = document.querySelector('.basket__order-price > .price_field');
        let totalCost = 0;

        for(let key in basketItems) {
            totalCost += basketItems[key][0] * basketItems[key][1];
        }

        totalCost += deliveryCost;

        if (totalCost > freeDelivery) {
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

        console.log(totalCostGlobal);
    }

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

        console.log(basketItems);
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

        console.log(basketItems);
    }

    function addItemToBasket(img_src, name, weight, price) {
        const button = document.querySelector('.add_button');

        if (handleFunction) button.removeEventListener('click', handleFunction);

        handleFunction = () => createItem(img_src, name, weight, price);
        button.addEventListener('click', handleFunction);
    }

    function createModalIcon(data, index, i) {
        const { img_src, price, name, weight, calories, composition, description } = data[index].items[i];
        const modalContent = document.querySelector('.modal__content');
        const goodsCompoundList = modalContent.querySelector('.goods__compound-list');
        goodsCompoundList.innerHTML = '';

        modalContent.querySelector('.modal__header').textContent = name;
        modalContent.querySelector('.goods__image').src = img_src;
        modalContent.querySelector('.goods__description').textContent = description;
        modalContent.querySelector('.goods__total').textContent = '1';

        if (composition) {
            for (let element of composition) {
                const li = document.createElement('li');
                li.textContent = element;
                goodsCompoundList.append(li);
            }
        }

        if (document.querySelector('.in-basket')) {
            if (basketItems.hasOwnProperty(name)) {
                document.querySelector('.goods__add').style.display = 'none';
                document.querySelector('.in-basket').style.display = 'block';
            } else {
                document.querySelector('.goods__add').style.display = 'flex';
                document.querySelector('.in-basket').style.display = 'none';
            }
        }

        modalContent.querySelector('.goods__weight').textContent = `${weight}г, ккал ${calories}`;
        modalContent.querySelector('.goods__price').textContent = price;
        calcTotalGoods();
        addItemToBasket(img_src, name, weight, price);
        showModalIcon('#dynamic-modal');
    }

    getNavList()
        .then(() => {
            const navList = document.querySelectorAll('.nav_item');
            const firstNavItem = navList[0];

            if (firstNavItem) {
                const firstIndex = firstNavItem.getAttribute('data-nav-index');
                const cardsContainer = document.querySelector('.cards_container');

                hideNavItem(navList);
                showNavItem(navList, firstIndex);

                getResource('http://localhost:3000/menu')
                        .then(data => {
                            currentData = data;
                            document.querySelector('.menu_header').textContent = data[firstIndex].name;
                            if (data[firstIndex].hasOwnProperty('items') && data[firstIndex].items.length > 0) {
                                data[firstIndex].items.forEach((menuItem, i) => {
                                    const { img_src, price, name, weight } = menuItem;
                                    const fillingDivItem = `
                                        <img class="img card_img" src=${img_src}>
                                        <p class="p card_price">${price}</p>
                                        <h3 class="h card_header">${name}</h3>
                                        <p class="p card_weight">${weight}г</p>
                                        <button data-card-index="${i}" class="button card_button">Додати</button>
                                    `;
                                    const divItem = document.createElement('div');
                                    divItem.classList.add('menu_card');
                                    divItem.innerHTML = fillingDivItem;
                                    cardsContainer.append(divItem);
                                });
                            }
                        });
            }

            document.querySelector('.nav').addEventListener('click', e => {
                const target = e.target.closest('.nav_item');
                if (e.target && target) {
                    const index = target.getAttribute('data-nav-index');
                    const cardsContainer = document.querySelector('.cards_container');
                    cardsContainer.innerHTML = '';

                    hideNavItem(navList);
                    showNavItem(navList, index);

                    getResource('http://localhost:3000/menu')
                        .then(data => {
                            currentData = data;
                            document.querySelector('.menu_header').textContent = data[index].name;
                            if (data[index].hasOwnProperty('items') && data[index].items.length > 0) {
                                data[index].items.forEach((menuItem, i) => {
                                    const { img_src, price, name, weight } = menuItem;
                                    const fillingDivItem = `
                                        <img class="img card_img" src=${img_src}>
                                        <p class="p card_price">${price}</p>
                                        <h3 class="h card_header">${name}</h3>
                                        <p class="p card_weight">${weight}г</p>
                                        <button data-card-index="${i}" class="button card_button">Додати</button>
                                    `;
                                    const divItem = document.createElement('div');
                                    divItem.classList.add('menu_card');
                                    divItem.innerHTML = fillingDivItem;
                                    cardsContainer.append(divItem);
                                });
                            }
                        });
                }
            });

            document.querySelector('.cards_container').addEventListener('click', e => {
                if (e.target && e.target.classList.contains('card_button')) {
                    const itemIndex = e.target.getAttribute('data-card-index');
                    const categoryIndex = document.querySelector('.nav_item_active').getAttribute('data-nav-index');
                    if (currentData) createModalIcon(currentData, categoryIndex, itemIndex);
                }
            });
        });

    // Hide modal icon

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target && (e.target.matches('.modal__close') || e.target === modal)) {
                hideModalIcon();
            }
        })
    });

    function showBasket() {
        document.querySelector('.basket__hero').addEventListener('click', () => {
            if (window.innerWidth <= 768 && totalGoods >= 1) {
                document.querySelector('.basket').classList.toggle('shadow');
                document.querySelector('.basket__details').classList.toggle('open');
            }
        });
    }

    showBasket();

    function deliveryModal() {
        const openModal = document.querySelector('.basket__order-button');

        openModal.addEventListener('click', () => {
            showModalIcon('#static-modal');
        });
    }

    deliveryModal();

    function toggleAddressBlock() {
        const addressBlock = document.querySelector('.address__block');
        const radioBlock = document.querySelector('.radio__block');

        document.querySelectorAll('input[type="radio"][name="delivery"]').forEach(radioButton => {
            radioButton.addEventListener('change', () => {
                if (radioButton.value === 'Доставка') {
                    addressBlock.classList.remove('hide');
                    radioBlock.classList.remove('radio__block-mb');
                } else {
                    addressBlock.classList.add('hide');
                    radioBlock.classList.add('radio__block-mb');
                }
            });
        });
    }

    toggleAddressBlock();

    function submitForm() {
        const form = document.querySelector('form');

        form.addEventListener('submit', e => {
            e.preventDefault();

            const arrEntries = Object.entries(basketItems);
            const orderObject = [];
            let currentName;

            for (let i = 0; i < arrEntries.length; i++) {
                const objItem = {};
                for (let j = 0; j < arrEntries[i].length; j++) {
                    if (Array.isArray(arrEntries[i][j])) {
                        const objInfo = {};
                        for (let k = 0; k < arrEntries[i][j].length; k++) {
                            objInfo[strArray[k]] = arrEntries[i][j][k];
                        }
                        objItem[currentName] = objInfo;
                    } else {
                        currentName = arrEntries[i][j];
                    }
                }
                orderObject.push(objItem);
            }

            const formData = new FormData(form);
            const formDataObject = Object.fromEntries(formData.entries());

            formDataObject.order = orderObject;
            if (!(totalCostGlobal > freeDelivery)) formDataObject.orderDelivery = deliveryCost;
            formDataObject.orderPrice = totalCostGlobal;

            const json = JSON.stringify(formDataObject);

            postData('http://localhost:3000/requests', json)
                .then(() => showModalMessage("Дякую! Скоро ми з вами зв'яжемося"))
                .catch(() => showModalMessage('Щось пішло не так...'))
                .finally(() => {
                    clearForm(form);
                    for (let key in basketItems) {
                        if (basketItems.hasOwnProperty(key)) {
                          delete basketItems[key];
                        }
                    }
                    clearBasket();
                });
        });
    }

    function showModalMessage(message) {
        const modalDialog = document.querySelector('#static-modal > .modal__dialog'),
              newModalContent = document.createElement('div');
        
        modalDialog.style.display = 'none';
        showModalIcon('#static-modal');

        newModalContent.classList.add('modal__dialog');
        newModalContent.innerHTML = `
            <div class='modal__content modal__message-padding' style='display: flex; justify-content: center;'>
                    <p class='p'>${message}</p>
            </div>
        `;

        document.querySelector('#static-modal').append(newModalContent);

        setTimeout(() => {
            newModalContent.remove();
            modalDialog.style.display = 'block';
            hideModalIcon();
        }, 2500);
    }

    function clearForm(form) {
        document.querySelector('.radio__block').classList.add('radio__block-mb');
        document.querySelector('.address__block').classList.add('hide');
        form.reset();
    }

    function clearBasket() {
        const basket = document.querySelector('.basket'),
              basketDetails = document.querySelector('.basket__details'),
              basketItems = document.querySelectorAll('.basket__item'),
              basketOrderBlock = document.querySelector('.basket__goods + div'),
              basketFreeBlock = document.querySelector('.basket__details > div:last-child');

        basketItems.forEach(item => item.remove());

        document.querySelector('.basket__goods').classList.remove('basket__goods-border');
        document.querySelector('.basket__total').textContent = 0;
        basketOrderBlock.classList.remove('basket__order-show');
        basketOrderBlock.classList.add('basket__order-hide');
        basket.classList.remove('shadow');
        if (basketDetails.classList.contains('open')) basketDetails.classList.remove('open');
        if (basketFreeBlock.classList.contains('basket__free-show')) {
            basketFreeBlock.classList.remove('basket__free-show');
            basketFreeBlock.classList.add('basket__free-hide');
        }
        totalGoods = 0, counter = 0, totalCostGlobal = 0;
    }

    submitForm();
});
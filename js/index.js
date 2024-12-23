'use strict'

document.addEventListener('DOMContentLoaded', () => {
    // NAV LIST

    const getResource = async url => {
        const result = await fetch(url);

        if (result.status !== 200) {
            throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    async function getNavList() {
        const data = await getResource('http://localhost:3000/nav');
        const list = document.querySelector('.nav');

        data.forEach(item => {
            const { title, img } = item,
                listItem = document.createElement('button');

            listItem.classList.add('nav_item');
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

    getNavList()
        .then(() => {
            const navList = document.querySelectorAll('.nav_item');
            navList.forEach((item, index) => {
                item.addEventListener('click', () => {
                    const cardsContainer = document.querySelector('.cards_container');
                    cardsContainer.innerHTML = '';

                    hideNavItem(navList);
                    showNavItem(navList, index);

                    getResource('http://localhost:3000/menu')
                        .then(data => {
                            document.querySelector('.menu_header').textContent = data[index].name;
                            if (data[index].hasOwnProperty('items')) {
                                for (let menuItem of data[index].items) {
                                    const { img_src, price, name, weight } = menuItem;
                                    const divItem = document.createElement('div');
                                    divItem.classList.add('menu_card');
                                    divItem.innerHTML = `
                                            <img class="img card_img" src=${img_src}>
                                            <p class="p card_price">${price}</p>
                                            <h3 class="h card_header">${name}</h3>
                                            <p class="p card_weight">${weight}</p>
                                            <button class="button card_button">Додати</button>
                                    `;
                                    cardsContainer.append(divItem);
                                }
                            }
                        });
                });
            });
        });
});
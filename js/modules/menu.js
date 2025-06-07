import { getResource } from "../services/service";
import { createModalIcon } from './modal/item-modal';
import { getNavList, showNavItem, hideNavItem } from './navigation';

let currentData = null;

async function getMenu() {
    await getNavList();

    const navList = document.querySelectorAll('.nav_item');
    const firstNavItem = navList[0];

    if (firstNavItem) {
        initMenu(firstNavItem, navList);
    }

    document.querySelector('.nav').addEventListener('click', e => {
        const target = e.target.closest('.nav_item');
        if (e.target && target) {
            initMenu(target, navList);
        }
    });

    document.querySelector('.cards_container').addEventListener('click', e => {
        if (e.target && e.target.classList.contains('card_button')) {
            const itemIndex = e.target.getAttribute('data-card-index');
            const categoryIndex = document.querySelector('.nav_item_active').getAttribute('data-nav-index');
            if (currentData) createModalIcon(currentData, categoryIndex, itemIndex);
        }
    });
}

async function initMenu(navItem, navList) {
    const index = navItem.getAttribute('data-nav-index');

    hideNavItem(navList);
    showNavItem(navList, index);

    currentData = await getResource('http://localhost:3000/menu');
    fillMenuContainer(currentData, index);
}

function fillMenuContainer(currentData, index) {
    const cardsContainer = document.querySelector('.cards_container');
    cardsContainer.innerHTML = '';

    document.querySelector('.menu_header').textContent = currentData[index].name;
    if (currentData[index].hasOwnProperty('items') && currentData[index].items.length > 0) {
        currentData[index].items.forEach((menuItem, i) => {
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
}

export { getMenu };
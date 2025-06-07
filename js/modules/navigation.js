import { getResource } from '../services/service';

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

export { getNavList, showNavItem, hideNavItem };
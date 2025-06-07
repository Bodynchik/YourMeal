import { calcTotalGoods } from '../calc-total-goods';
import { addItemToBasket } from '../basket';
import { basketItems } from '../create-item';
import { showModalIcon } from './modal';

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

export { createModalIcon };
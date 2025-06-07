import { createItem, resetBasketState } from './create-item';
import { totalGoods } from './create-item';

let handleFunction;

function showBasket() {
    document.querySelector('.basket__hero').addEventListener('click', () => {
        if (window.innerWidth <= 768 && totalGoods >= 1) {
            document.querySelector('.basket').classList.toggle('shadow');
            document.querySelector('.basket__details').classList.toggle('open');
        }
    });
}

function addItemToBasket(img_src, name, weight, price) {
    const button = document.querySelector('.add_button');

    if (handleFunction) button.removeEventListener('click', handleFunction);

    handleFunction = () => createItem(img_src, name, weight, price);
    button.addEventListener('click', handleFunction);
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
    resetBasketState();
}

export { showBasket, addItemToBasket, clearBasket };
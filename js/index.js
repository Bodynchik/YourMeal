'use strict'

import '../styles/global.css';
import '../styles/component.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/main.css';

import { getMenu } from './modules/menu';
import { freeDelivery } from './modules/create-item';
import { deliveryModal } from './modules/modal/delivery-modal';
import { showBasket } from './modules/basket';
import { toggleAddressBlock, submitForm } from './modules/form';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.hero_p').textContent = `Безкоштовна доставка від ${freeDelivery}₴`;

    getMenu();
    showBasket();
    deliveryModal();
    toggleAddressBlock();
    submitForm();
});
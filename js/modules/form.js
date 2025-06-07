import { postData } from '../services/service';
import { basketItems, freeDelivery, deliveryCost } from './create-item';
import { totalCostGlobal } from './create-item';
import { showModalMessage } from './modal/message-modal';
import { clearBasket } from './basket';

const strArray = ['Кількість', 'Ціна за одиницю'];

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

function clearForm(form) {
    document.querySelector('.radio__block').classList.add('radio__block-mb');
    document.querySelector('.address__block').classList.add('hide');
    form.reset();
}

export { toggleAddressBlock, submitForm };
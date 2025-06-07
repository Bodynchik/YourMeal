import { showModalIcon } from './modal';

function deliveryModal() {
    const openModal = document.querySelector('.basket__order-button');

    openModal.addEventListener('click', () => {
        showModalIcon('#static-modal');
    });
}

export { deliveryModal };
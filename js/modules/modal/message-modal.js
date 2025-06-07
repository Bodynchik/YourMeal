import { showModalIcon, hideModalIcon } from './modal';

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

export { showModalMessage };
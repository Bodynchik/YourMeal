let scrollY = 0;

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

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target && (e.target.matches('.modal__close') || e.target === modal)) {
            hideModalIcon();
        }
    })
});

export { showModalIcon, hideModalIcon };
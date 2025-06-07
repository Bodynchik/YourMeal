function calcTotalGoods() {
    const goodsMinus = document.querySelector('.goods__minus');
    const goodsPlus = document.querySelector('.goods__plus');

    goodsMinus.removeEventListener('click', totalGoodsMinus);
    goodsPlus.removeEventListener('click', totalGoodsPlus);

    goodsMinus.addEventListener('click', totalGoodsMinus);
    goodsPlus.addEventListener('click', totalGoodsPlus);
}

function totalGoodsMinus() {
    const goodsTotal = document.querySelector('.goods__total');
    let goodsTotalNumber = +goodsTotal.textContent;
    const goodsMin = 1;

    if (goodsTotalNumber > goodsMin) {
        goodsTotalNumber--;
        goodsTotal.textContent = goodsTotalNumber;
    }
}

function totalGoodsPlus() {
    const goodsTotal = document.querySelector('.goods__total');
    let goodsTotalNumber = +goodsTotal.textContent;
    const goodsMax = 5;

    if (goodsTotalNumber < goodsMax) {
        goodsTotalNumber++;
        goodsTotal.textContent = goodsTotalNumber;
    }
}

export { calcTotalGoods };
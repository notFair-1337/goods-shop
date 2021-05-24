const catalog = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const catalogControls = document.getElementById('catalog-controls');
const searchForm = document.getElementById('catalog-search');
const modalImg = document.querySelector('.goods-modal__img img');
const modal = document.querySelector('.goods-modal');
const modalOverlay = document.querySelector('.modal__overlay');
let categories = [];
let goods = [];
let isModalOpen = false;

class goodsItem {

    constructor(image, title, price, category) {
        this.image = image;
        this.title = title;
        this.price = price;
        this.category = category;
    }

    createGoods() {
        const item = document.createElement('div');
        item.classList.add('catalog-grid__item');
        item.innerHTML =
            `
            <div class="goods-item">
                <div class="goods-item__img">
                    <img src="${this.image}" alt="${this.title}" class="goods-img">
                </div>
                <div class="goods-item__content">
                    <p class="goods-item__title">${this.title}</p>
                    <p class="goods-item__price">$${this.price}</p>
                </div>
            </div>
        `;

        catalog.insertAdjacentElement('beforeend', item);

    }
}


searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase();
    searchGoods(val);
})
catalogControls.addEventListener('click', (e) => {

    toggleCategoryActiveClass(e);
    filterGoods(e)


});

document.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('goods-img')) {
        modalImg.src = target.src;
        toggleModal();
    }else if(target.classList.contains('modal__overlay')){
        toggleModal();
    }

});
document.addEventListener('keyup', (e)=>{
    if(isModalOpen && e.key === "Escape"){
        toggleModal();
    }
})

function toggleModal() {
    isModalOpen = !isModalOpen;
    if (isModalOpen) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}


function searchGoods(searchValue) {
    const filtered = goods.filter((item) => {
        return item.title.toUpperCase().indexOf(searchValue) > -1
    })
    renderCatalog(filtered);
}

// update goods list
function filterGoods(e) {
    const target = e.target;
    let filteredArray = goods;

    if (target.dataset.category === 'all') {
        filteredArray = goods;
        console.log(filteredArray);
        renderCatalog(filteredArray);

        return;
    }

    filteredArray = goods.filter((item) => {
        return item.category === target.dataset.category
    })

    renderCatalog(filteredArray);
    console.log(filteredArray);
}

function createCategory() {
    setCategories();
    createCategoryButton(categories);
}
// toggle class 
function toggleCategoryActiveClass(e) {
    const target = e.target;

    if (target.getAttribute('data-category')) {
        const categoryButtons = document.querySelectorAll('.category-btn');

        categoryButtons.forEach((item) => {
            item.classList.remove('btn-primary')
            item.classList.add('btn-secondary');
        })

        if (target.classList.contains('btn-primary')) {
            target.classList.remove('btn-primary');
            target.classList.add('btn-secondary');
        } else if (target.classList.contains('btn-secondary')) {
            target.classList.add('btn-primary');
            target.classList.remove('btn-secondary');
        } else {
            target.classList.add('btn-primary');
        }
    }
}

// get all categories from goods array 
function setCategories() {
    const categoriesAll = goods.map((item) => {
        return item.category
    });

    categories = new Set(categoriesAll);
};

// create html template of button
function createCategoryButton(categoriesArr) {
    categoriesArr.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn btn btn-secondary';
        btn.innerText = item;
        btn.setAttribute('data-category', item);

        catalogControls.insertAdjacentElement('beforeend', btn);
    });
};


function renderCatalog(goods) {
    catalog.innerHTML = '';
    goods.forEach((item) => {
        new goodsItem(
            item.image,
            item.title,
            item.price,
            item.category).createGoods();
    });

}


const getGoods = async () => {
    await fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => goods = data)
}

getGoods().then(() => {

    renderCatalog(goods);
    createCategory();
});


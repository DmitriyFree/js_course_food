
window.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabPatent = document.querySelector('.tabheader__items');

  function hideTabs() {
    tabsContent.forEach(elem => {
      elem.classList.add('hide');
      elem.classList.remove('show', 'fade');
    });
    tabs.forEach(elem => {
      elem.classList.remove('tabheader__item_active');
    });
  }

  function showTabs(i = 0) {
    tabsContent[i].classList.remove('hide');
    tabsContent[i].classList.add('show', 'fade');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabs();
  showTabs();

  tabPatent.addEventListener('click', (e) => {

    const target = e.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((elem, i) => {
        if(target == elem) {
          hideTabs();
          showTabs(i);
        }
      });
    }
  });


  const deadline = '2021-08-02';

  function getTimeRemaining(endtime) {

    const t = Date.parse(endtime) - Date.parse(new Date());
          days = Math.floor(t / (1000 * 60 * 60 * 24));
          hours = Math.floor((t / (100 * 60 * 60)) % 24);
          minutes = Math.floor((t / (1000 * 60)) % 60);
          seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  }

  function convertZero (num) {
    if (num >= 0 && num < 10) {
       return `0${num}`;
    }
    else return num;
  }

  function setClock(selector, endtime) {

    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {

      const t = getTimeRemaining(endtime);
      days.textContent = convertZero(t.days);
      hours.textContent = convertZero(t.hours);
      minutes.textContent = convertZero(t.minutes);
      seconds.textContent = convertZero(t.seconds);


      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }

  }

  setClock('.timer', deadline);

  // Modal

  const modalTriger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalClose = document.querySelector('[data-close]');


  function showModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = "hidden";
    clearInterval(showModalTimer);
  }

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = "";
  }

  modalTriger.forEach(item => {
    item.addEventListener('click', () => {
      showModal();
    });
  });

  modalClose.addEventListener('click', () => {
    closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const showModalTimer = setInterval(showModal, 5000);

  function scrollShowModal() {
    if (document.documentElement.clientHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight) {
      showModal();
      document.removeEventListener('scroll', scrollShowModal);
    }
  }

  document.addEventListener('scroll', scrollShowModal);

  // Cards

  class Card {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.parseToUAN();
    }

    parseToUAN() {
      this.price = this.price * this.transfer;
    }

    render() {

      const cardItem = document.createElement('div');

      if (this.classes.length == 0) {
        cardItem.classList.add('menu__item');
      } else {
        this.classes.forEach(item => cardItem.classList.add(item));
      }

      cardItem.innerHTML=`
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
      `;
      this.parent.append(cardItem);

    }

  }

  new Card(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
     9,
     '.menu .container'
  ).render();

  new Card(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
     20,
     '.menu .container'
  ).render();

  new Card(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
     17,
     '.menu .container'
  ).render();


});
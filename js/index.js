
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


  const deadline = '2021-08-31';

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
        modal = document.querySelector('.modal');

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


  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == "") {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const showModalTimer = setInterval(showModal, 50000);

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

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }

    return await res.json();

  };

  getResource('http://localhost:3000/menu')
  .then(data => {
    data.forEach(({img, altimg, title, descr, price}) => {
      new Card(img, altimg, title, descr, price, '.menu .container').render();
    });
  });

  // form

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/modal/spinner.svg',
    success: 'Спасибо, скоро мы с вами свяжемся',
    fail: 'Что-то пошло не так'
  }

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    })

    return await res.json();

  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {

      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      form.append(statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showModalMessage(message.success);
        statusMessage.remove();
      }).catch(() => {
        showModalMessage(message.fail);
      }).finally(() => {
        form.reset();
      });

     });
  }

  function showModalMessage(message) {

    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    showModal();

    const messageModal = document.createElement('div');
    messageModal.classList.add('modal__dialog');
    messageModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>x</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(messageModal);

    setTimeout(() => {
      messageModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();

    }, 10000);

  }

  // slider

  const prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        slides = document.querySelectorAll('.offer__slide'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesInner = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

  let showIndex = 1;
  let offset = 0;

  current.textContent = convertZero(showIndex);
  total.textContent = convertZero(slides.length);

  slidesInner.style.width = 100 * slides.length + '%';
  slidesInner.style.display = 'flex';
  slidesInner.style.transition = 'all 0.5s';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(item => {
    item.style.width = width;
  });

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, -2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, -2);
    }

    slidesInner.style.transform = `translateX(-${offset}px)`;

    if (showIndex >= slides.length) {
      showIndex = 1;
    } else {
      showIndex++;
    }

    current.textContent = convertZero(showIndex);
  });

  prev.addEventListener('click', () => {
    if (offset <= 0) {
      offset = +width.slice(0, -2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, -2);
    }

    slidesInner.style.transform = `translateX(-${offset}px)`;

    if (showIndex == 1) {
      showIndex = slides.length;
    } else {
      showIndex--;
    }

    current.textContent = convertZero(showIndex);

  });

});



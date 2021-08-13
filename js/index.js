
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
        slider = document.querySelector('.offer__slider'),
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

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];

  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
  `;

  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;`;

    if (i == 0) {
      dot.style.opacity = 1;
    }

    indicators.append(dot);
    dots.push(dot);
  }

  function removeNoDigits(str) {
    return +str.replace(/\D/g, '')
  }

  next.addEventListener('click', () => {
    if (offset == removeNoDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += removeNoDigits(width) ;
    }

    slidesInner.style.transform = `translateX(-${offset}px)`;

    if (showIndex >= slides.length) {
      showIndex = 1;
    } else {
      showIndex++;
    }

    current.textContent = convertZero(showIndex);

    dots.forEach(item => item.style.opacity = '0.5');
    dots[showIndex - 1].style.opacity = 1;
  });

  prev.addEventListener('click', () => {
    if (offset <= 0) {
      offset = removeNoDigits(width) * (slides.length - 1);
    } else {
      offset -= removeNoDigits(width)
    }

    slidesInner.style.transform = `translateX(-${offset}px)`;

    if (showIndex == 1) {
      showIndex = slides.length;
    } else {
      showIndex--;
    }

    current.textContent = convertZero(showIndex);

    dots.forEach(item => item.style.opacity = '0.5');
    dots[showIndex - 1].style.opacity = 1;
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');
      showIndex = slideTo;

      offset = removeNoDigits(width)  * (slideTo - 1);


    slidesInner.style.transform = `translateX(-${offset}px)`;

    current.textContent = convertZero(showIndex);

    dots.forEach(item => item.style.opacity = '0.5');
    dots[showIndex - 1].style.opacity = 1;


    });
  });

  // calculator

  const result = document.querySelector('.calculating__result span');

  let gender, height, weight, age, ratio;

  if (localStorage.getItem('gender')) {
    gender = localStorage.getItem('gender');
  } else {
    gender = 'female';
    localStorage.setItem('gender', gender);
  }

  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    ratio = '1.375';
    localStorage.setItem('ratio', ratio);
  }

  function initLocalSetting(selector, activeClass) {

    // console.log(localStorage.getItem('gender'));

    const elements = document.querySelectorAll(selector);

    elements.forEach(item => {
      item.classList.remove(activeClass);

      if (item.getAttribute('id') === localStorage.getItem('gender')) {
        item.classList.add(activeClass);
      }
      if(item.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        item.classList.add(activeClass);
      }
    });
  }

  initLocalSetting('#gender div', 'calculating__choose-item_active');
  initLocalSetting('.calculating__choose_big div', 'calculating__choose-item_active');


  function caclTotal() {

    if (!gender || !height || !weight || !age || !ratio) {
      result.innerHTML = '_____';
      return;
    }

    if (gender == 'female') {
      result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
      result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
  }

  caclTotal();

  function getStaticInfo(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', ratio);
        } else {
          gender = e.target.getAttribute('id');
          localStorage.setItem('gender', gender);
        }

        elements.forEach(item => {
          item.classList.remove(activeClass);
        });
        e.target.classList.add(activeClass);
        caclTotal();
      });
    });
  }

  getStaticInfo('#gender div', 'calculating__choose-item_active');
  getStaticInfo('.calculating__choose_big div', 'calculating__choose-item_active');


  function getDunamicInfo(selector) {

    const input = document.querySelector(selector);

    input.addEventListener('input', () => {

      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }


      switch(input.getAttribute('id')) {
        case 'height': {
          height = +input.value;
          break;
        }
        case 'weight': {
          weight = +input.value;
          break;
        }
        case 'age': {
          age = +input.value;
          break;
        }
      }
      caclTotal();
    });

  }

  getDunamicInfo('#height');
  getDunamicInfo('#weight');
  getDunamicInfo('#age');

});



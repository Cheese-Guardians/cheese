/**
* Template Name: eNno
* Updated: Mar 10 2023 with Bootstrap v5.2.3
* Template URL: https://bootstrapmade.com/enno-free-simple-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Initiate glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()

//캘린더
document.addEventListener("DOMContentLoaded", function() {
  buildCalendar();
});

var today = new Date(); // @param 전역 변수, 오늘 날짜 / 내 컴퓨터 로컬을 기준으로 today에 Date 객체를 넣어줌
var date = new Date();  // @param 전역 변수, today의 Date를 세어주는 역할

/**
* @brief   이전달 버튼 클릭
*/
function prevCalendar() {
  this.today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  buildCalendar();    // @param 전월 캘린더 출력 요청
}

/**
* @brief   다음달 버튼 클릭
*/
function nextCalendar() {
  this.today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  buildCalendar();    // @param 명월 캘린더 출력 요청
}

/**
* @brief   캘린더 오픈
* @details 날짜 값을 받아 캘린더 폼을 생성하고, 날짜값을 채워넣는다.
*/
function buildCalendar() {

  let doMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  let tbCalendar = document.querySelector(".scriptCalendar > tbody");

  document.getElementById("calYear").innerText = today.getFullYear();                                  // @param YYYY월
  document.getElementById("calMonth").innerText = autoLeftPad((today.getMonth() + 1), 2);   // @param MM월


  // @details 이전 캘린더의 출력결과가 남아있다면, 이전 캘린더를 삭제한다.
  while(tbCalendar.rows.length > 0) {
      tbCalendar.deleteRow(tbCalendar.rows.length - 1);
  }


  // @param 첫번째 개행
  let row = tbCalendar.insertRow();



  // @param 날짜가 표기될 열의 증가값
  let dom = 1;

  // @details 시작일의 요일값( doMonth.getDay() ) + 해당월의 전체일( lastDate.getDate())을  더해준 값에서
  //               7로 나눈값을 올림( Math.ceil() )하고 다시 시작일의 요일값( doMonth.getDay() )을 빼준다.
  let daysLength = (Math.ceil((doMonth.getDay() + lastDate.getDate()) / 7) * 7) - doMonth.getDay();

  // @param 달력 출력
  // @details 시작값은 1일을 직접 지정하고 요일값( doMonth.getDay() )를 빼서 마이너스( - )로 for문을 시작한다.
  for(let day = 1 - doMonth.getDay(); daysLength >= day; day++) {

      let column = row.insertCell();

      // @param 평일( 전월일과 익월일의 데이터 제외 )
      if(Math.sign(day) == 1 && lastDate.getDate() >= day) {


          // @param 평일 날짜 데이터 삽입

          column.innerText = autoLeftPad(day, 2);


          // @param 일요일인 경우
          if(dom % 7 == 1) {
              column.style.color = "#FF4D4D";
          }

          // @param 토요일인 경우
          if(dom % 7 == 0) {
              column.style.color = "#4D4DFF";
              row = tbCalendar.insertRow();   // @param 토요일이 지나면 다시 가로 행을 한줄 추가한다.
          }

      }

      // @param 평일 전월일과 익월일의 데이터 날짜변경
      else {
          let exceptDay = new Date(doMonth.getFullYear(), doMonth.getMonth(), day);
          column.innerText = autoLeftPad(exceptDay.getDate(), 2);
          column.style.color = "#A9A9A9";
      }

      // @brief   전월, 명월 음영처리
      // @details 현재년과 선택 년도가 같은경우
      if(today.getFullYear() == date.getFullYear()) {

          // @details 현재월과 선택월이 같은경우
          if(today.getMonth() == date.getMonth()) {

              // @details 현재일보다 이전인 경우이면서 현재월에 포함되는 일인경우
              if(date.getDate() > day && Math.sign(day) == 1) {
                  column.style.backgroundColor = "#FFFFFF";
                  column.style.cursor = "pointer";
                  column.onclick = function(){ calendarChoiceDay(this); }
              }

              // @details 현재일보다 이후이면서 현재월에 포함되는 일인경우
              else if(date.getDate() < day && lastDate.getDate() >= day) {
                  column.style.backgroundColor = "#FFFFFF";
                  column.style.cursor = "pointer";
                  column.onclick = function(){ calendarChoiceDay(this); }
              }

              // @details 현재일인 경우
              else if(date.getDate() == day) {
                column.style.backgroundColor = "#FFFFFF";
                column.style.cursor = "pointer";
                column.onclick = function(){ calendarChoiceDay(this); }
              }

          // @details 현재월보다 이전인경우
          } else if(today.getMonth() < date.getMonth()) {
            column.style.backgroundColor = "#FFFFFF";
            column.style.cursor = "pointer";
            column.onclick = function(){ calendarChoiceDay(this);
            }
          }

          // @details 현재월보다 이후인경우
          else {
              if(Math.sign(day) == 1 && day <= lastDate.getDate()) {
                  column.style.backgroundColor = "#FFFFFF";
                  column.style.cursor = "pointer";
                  column.onclick = function(){ calendarChoiceDay(this); }
              }
          }
      }

      // @details 선택한년도가 현재년도보다 작은경우
      else if(today.getFullYear() < date.getFullYear()) {
        column.style.backgroundColor = "#FFFFFF";
        column.style.cursor = "pointer";
        column.onclick = function(){ calendarChoiceDay(this);
        }
      }

      // @details 선택한년도가 현재년도보다 큰경우
      else {
          if(Math.sign(day) == 1 && day <= lastDate.getDate()) {
              column.style.backgroundColor = "#FFFFFF";
              column.style.cursor = "pointer";
              column.onclick = function(){ calendarChoiceDay(this); }
          }
      }


      dom++;

  }
}

/**
* @brief   날짜 선택
* @details 사용자가 선택한 날짜에 체크표시를 남긴다.
*/
function calendarChoiceDay(column) {

  // @param 기존 선택일이 존재하는 경우 기존 선택일의 표시형식을 초기화 한다.
  if(document.getElementsByClassName("choiceDay")[0]) {
      document.getElementsByClassName("choiceDay")[0].style.backgroundColor = "#FFFFFF";
      document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");
  }

  // @param 선택일 체크 표시
  column.style.backgroundColor = "#FF9999";


  // @param 선택일 클래스명 변경
  column.classList.add("choiceDay");
}

/**
* @brief   숫자 두자릿수( 00 ) 변경
* @details 자릿수가 한자리인 ( 1, 2, 3등 )의 값을 10, 11, 12등과 같은 두자리수 형식으로 맞추기위해 0을 붙인다.
* @param   num     앞에 0을 붙일 숫자 값
* @param   digit   글자의 자릿수를 지정 ( 2자릿수인 경우 00, 3자릿수인 경우 000 … )
*/
function autoLeftPad(num, digit) {
  if(String(num).length < digit) {
      num = new Array(digit - String(num).length + 1).join("0") + num;
  }
  return num;
}
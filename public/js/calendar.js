
//캘린더
document.addEventListener("DOMContentLoaded", function() {
    buildCalendar();
    parseQueryString();
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
                    column.style.cursor = "pointer";
                    column.onclick = function(){ calendarChoiceDay(this); }
                }
  
                // @details 현재일보다 이후이면서 현재월에 포함되는 일인경우
                else if(date.getDate() < day && lastDate.getDate() >= day) {
                    column.style.cursor = "pointer";
                    column.onclick = function(){ calendarChoiceDay(this); }
                }
  
                // @details 현재일인 경우
                else if(date.getDate() == day) {
                  column.style.cursor = "pointer";
                  column.onclick = function(){ calendarChoiceDay(this); }
                  //calendarChoiceDay(column);
                }
  
            // @details 현재월보다 이전인경우
            } else if(today.getMonth() < date.getMonth()) {
              column.style.cursor = "pointer";
              column.onclick = function(){ calendarChoiceDay(this);
              }
            }
  
            // @details 현재월보다 이후인경우
            else {
                if(Math.sign(day) == 1 && day <= lastDate.getDate()) {
                    column.style.cursor = "pointer";
                    column.onclick = function(){ calendarChoiceDay(this); }
                }
            }
        }
  
        // @details 선택한년도가 현재년도보다 작은경우
        else if(today.getFullYear() < date.getFullYear()) {
          column.style.cursor = "pointer";
          column.onclick = function(){ calendarChoiceDay(this);
          }
        }
  
        // @details 선택한년도가 현재년도보다 큰경우
        else {
            if(Math.sign(day) == 1 && day <= lastDate.getDate()) {
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
    if (document.getElementsByClassName("choiceDay")[0]) {
      document.getElementsByClassName("choiceDay")[0].style.backgroundColor = "#FFFFFF";
      document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");
    }
  
    // @param 선택일 체크 표시
    column.style.backgroundColor = "#B3CC62";
  
    // @param 선택일 클래스명 변경
    column.classList.add("choiceDay");
  
    // @param 선택한 날짜를 HTML 요소에 표시
    let selectedDate = column.innerText;
    let selectedYear = document.getElementById("calYear").innerText;
    let selectedMonth = document.getElementById("calMonth").innerText;
    document.getElementById("selected_date").innerText = selectedYear + "년 " + selectedMonth + "월 " + selectedDate + "일";
  
    // @param 선택한 날짜 정보를 쿼리스트링으로 전달하여 새로운 URL로 이동
    const queryString = `?selectedYear=${selectedYear}&selectedMonth=${selectedMonth}&selectedDate=${selectedDate}`;
    const newURL = window.location.origin + window.location.pathname + queryString;
    window.location.href = newURL;
  }
  //쿼리스트링 파싱해서 해당 일에 불 들어오게 html안에 년월일 넣어줌
  function parseQueryString() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const selectedYear = urlParams.get('selectedYear');
    const selectedMonth = urlParams.get('selectedMonth');
    const selectedDate = urlParams.get('selectedDate');
  
    if (selectedYear && selectedMonth && selectedDate) {
      const tbCalendar = document.querySelector(".scriptCalendar > tbody");
      const rows = tbCalendar.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].getElementsByTagName("td");
        for (let j = 0; j < columns.length; j++) {
          if (columns[j].innerText === selectedDate) {
            calendarColorDay(columns[j]);
            return;
          }
        }
      }
    }
  }
  function calendarColorDay(column) {
    // @param 기존 선택일이 존재하는 경우 기존 선택일의 표시형식을 초기화 한다.
    if (document.getElementsByClassName("choiceDay")[0]) {
      document.getElementsByClassName("choiceDay")[0].style.backgroundColor = "#FFFFFF";
      document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");
    }
  
    // @param 선택일 체크 표시
    column.style.backgroundColor = "#B3CC62";
  
    // @param 선택일 클래스명 변경
    column.classList.add("choiceDay");
  
    // @param 선택한 날짜를 HTML 요소에 표시
    let selectedDate = column.innerText;
    let selectedYear = document.getElementById("calYear").innerText;
    let selectedMonth = document.getElementById("calMonth").innerText;
    document.getElementById("selected_date").innerText = selectedYear + "년 " + selectedMonth + "월 " + selectedDate + "일";
  
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
  
  // 슬라이드 이미지 선택자
  const sliderImages = document.querySelectorAll('.slide')
  // 오른쪽 화살표 선택자
  const arrowRight = document.querySelector('.arrow--right')
  // 왼쪽 화살표 선택자
  const arrowLeft = document.querySelector('.arrow--left')
  // 현재 보여지는 슬라이드 번호
  let current = 0;
  
  // 동그라미들 선택자
  const dots = document.querySelectorAll('.dot')
  const dot1 = document.querySelector('.dot1')
  const dot2 = document.querySelector('.dot2')
  const dot3 = document.querySelector('.dot3')
  const dot4 = document.querySelector('.dot4')
  const dot5 = document.querySelector('.dot5')
  const dot6 = document.querySelector('.dot6')
  
  // 슬라이드 이미지 리셋
  const reset = () => {
      // 슬라이드 이미지 모두 보이지 않는 상태로 설정
      sliderImages.forEach((el) => el.style.display = 'none')
      dots.forEach((el) => el.style.background = '#F6F5F0')
  }
  
  // 자동 슬라이드 기능을 위한 함수
  const autoSlide = () => {
      // 모든 슬라이드 이미지를 보이지 않는 상태로 설정
      reset()
      // 마지막 슬라이드 이미지라면,
      if (current === sliderImages.length - 1) {
          // current 값을 -1로 설정
          current = -1
      } 
      
      // 마지막 슬라이드 이미지가 아니라면,
      // current 값에 1을 더함
      current++
      // 슬라이드 이미지 배열에서 index값이 current인 이미지를 보이는 상태로 설정 
      sliderImages[current].style.display = 'block'
      dots[current].style.background = '#1107ff'
  }
  
  // 수동 슬라이드를 위한 함수들
  // 1. 왼쪽 화살표에 클릭 이벤트가 발생할 시 작동할 함수
  const slideLeft = () => {
      // 모든 슬라이드 이미지 display를 none으로 리셋
      reset()
      // current(현재 보여지는 슬라이드 이미지)의 
      // 이전 슬라이드 이미지가 보이도록 스타일 변경
      sliderImages[current - 1].style.display = 'block';
      dots[current - 1].style.background = '#1107ff'
      // current값을 1만큼 뺌
      current--;
  }
  
  // 2. 오른쪽 화살표에 클릭 이벤트가 발생할 시 작동할 함수
  const slideRight = () => {
      // 모든 슬라이드 이미지 display를 none으로 리셋
      reset()
      // current(현재 보여지는 슬라이드 이미지)의 
      // 다음 슬라이드 이미지가 보이도록 스타일 변경 
      sliderImages[current + 1].style.display = 'block';
      dots[current + 1].style.background = '#1107ff'
      // current값을 1만큼 더함
      current++;
  }
  
  // 오른쪽 화살표를 클릭할 시 작동하는 익명의 함수
  arrowLeft.addEventListener('click', function() {
      // 만약 current값이 0이라면,
      // 즉 현재 보이는 슬라이드 이미지가 첫번째 순서라면,
      if(current === 0) {
          // current값을 슬라이드 이미지 배열의 길이로 변경
          current = sliderImages.length;
      }
      slideLeft()
  })
  
  // 왼쪽 화살표를 클릭할 시 작동하는 익명의 함수
  arrowRight.addEventListener('click', function() {
      // 만약 current값이 슬라이드 이미지 배열 길이 - 1만큼의 값이라면,
      // 즉 현재 보이는 슬라이드 이미지가 마지막 순서라면,
      if(current === sliderImages.length - 1) {
          // current값을 -1로 설정
          current = -1;
      }
      slideRight()
  })
  
  // 첫번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot1.addEventListener("click", function(){
      reset()
      current = 0
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  // 두번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot2.addEventListener("click", function(){
      reset()
      current = 1
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  // 세번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot3.addEventListener("click", function(){
      reset()
      current = 2
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  // 네번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot4.addEventListener("click", function(){
      reset()
      current = 3
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  // 다섯번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot5.addEventListener("click", function(){
      reset()
      current = 4
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  // 여섯번째 동그라미 클릭할 시 작동하는 익명의 함수
  dot6.addEventListener("click", function(){
      reset()
      current = 5
      sliderImages[current].style.display = 'block';
      dots[current].style.background = '#1107ff'
  })
  
  
  // 아이템들을 담을 아이템 리스트
  let itemList = [];
  // 아이템 중복확인 위한 변수
  let dupl;
  // 추가 버튼에 대한 이벤트
  let addBtn = document.querySelector("#add");
  addBtn.addEventListener("click", addList);
  // 전체삭제 버튼에 대한 이벤트
  let removeAllBtn = document.querySelector("#remove_all");
  //removeAllBtn.addEventListener("click", removeList);
  
  // 엔터 입력시 이벤트 발생
  document
    .querySelector("#item")
    .addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        addList();
      }
    });
  
  // 아이템 추가 메서드
  function addList() {
    // 아이템 값 담음
    let item = document.querySelector("#item").value;
    // console.log(item);
  
    // 중복체크 실행
    checkDupl(item);
  
    // 조건을 확인하고 아이템 리스트에 푸시
    if (item != "" && dupl) {
      itemList.push(item);
      // console.log(itemList);
  
      // 아이템 input 창 초기화
      document.querySelector("#item").value = "";
      document.querySelector("#item").focus();
  
      // 아이템 리스트 출력
      showList();
    }
  }
  
  // 중복확인 메서드
  function checkDupl(item) {
    // 입력한 아이템이 아이템 리스트에 있는지 확인
    if (itemList.includes(item)) {
      alert("이미 추가한 항목입니다.");
      document.querySelector("#item").value = "";
      document.querySelector("#item").focus();
      dupl = false;
    } else {
      dupl = true;
    }
  }
  
  // 아이템리스트 출력 메서드 (테이블)
  // 아이템리스트 출력 메서드 (테이블)
  function showList() {
    // 아이템 리스트를 for 문을 돌면서 테이블 태그로 생성
    let list = "<table>";
    for (let i = 0; i < itemList.length; i++) {
      list += `<tr>
        <td class="item">
          <div class="checkbox">
            <input type="checkbox" id="${i}" />
          </div>
          <div class="content">${itemList[i]}</div>
        </td>
        </tr>`;
    }
    list += "</table>";
  
    // 테이블 태그 출력
    document.querySelector("#item_list").innerHTML = list;
  
    // 아이템 리스트에서 체크박스 이벤트를 할당
    let checkboxes = document.querySelectorAll(".item input[type='checkbox']");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].onclick = toggleItem;
    }
  }
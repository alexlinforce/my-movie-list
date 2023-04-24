const BASE_URL = "https://webdev.alphacamp.io";
//宣告變數
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
const MOVIE_PER_PAGE = 12;
let filteredMovies = [];

//請求資料
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));

//宣告變數
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

//監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(event.target.dataset.id);
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

//監聽searchForm
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  //會請瀏覽器終止元件的預設行為，把控制權交給 JavaScript
  event.preventDefault();
  // console.log("click");
  const keyword = searchInput.value.trim().toLowerCase();
  console.log(keyword);
  // if (!keyword.length) {
  //   return alert("請輸入有效字串！");
  // }

  //方法一:用迴圈迭代：for-of
  // for (const movie of movies) {
  //   if (movie.title.trim().toLowerCase().includes(keyword)) {
  //     filterMovies.push(movie);
  //   }
  // }
  //方法二:用條件來迭代：filter
  // filterMovies = movies.filter((movie) =>
  //   movie.title.trim().toLowerCase().includes(keyword)

  //方法三:用條件來迭代：filter 且僅在該頁面的電影資料進行搜尋
  filteredMovies =
    keyword.trim() === ""
      ? movies
      : movies.filter((movie) =>
          movie.title.trim().toLowerCase().includes(keyword)
        );
  console.log(filteredMovies);

  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  //重置分頁器
  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

//renderMovieList方法
//title、image
function renderMovieList(data) {
  let renderHtml = "";
  data.forEach((item) => {
    renderHtml += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" type="button" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" type="button" data-id=${
                item.id
              }>+</button>
            </div>
          </div>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = renderHtml;
}

//showMovieModal方法
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDescription = document.querySelector("#movie-modal-description");
  const modalDate = document.querySelector("#movie-modal-date");

  //請求Show API資料
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results;
      console.log(data);
      modalTitle.innerText = data.title;
      modalDescription.innerText = data.description;
      modalImage.innerHTML = `<img src=${
        POSTER_URL + data.image
      } alt="movie-poster"
                class="image-fluid">`;
      modalDate.innerText = "Release date: " + data.release_date;
    })
    .catch((err) => console.log(err));
}

//新增喜歡的電影資料至瀏覽器的local storage儲存起來
function addToFavorite(id) {
  //取出存在local storage的favoriteMovies對應的value，沒有則給空陣列
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const favoriteMovie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(favoriteMovie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
  console.log(list);
}

//監聽paginator
paginator.addEventListener("click", (event) => {
  // //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
});

// getMoviesByPage方法:傳入分頁數，回傳已切割好的陣列
function getMoviesByPage(page) {
  //page 1-> movies   0--------11
  //page 2-> movies  12--------23
  //page 3-> movies  24--------35

  const startIndex = (page - 1) * MOVIE_PER_PAGE;
  const endIndex = startIndex + MOVIE_PER_PAGE;
  //如果搜尋清單有東西，就取搜尋清單 filteredMovies，否則就還是取總清單 movies
  const data = filteredMovies.length ? filteredMovies : movies;
  return data.slice(startIndex, endIndex);
}

//renderPaginator方法:動態產生分頁結構，需依據實際電影數量進行分頁。
function renderPaginator(amount) {
  //80 / 12 = 6......8 ->要七頁無條件進位使用 Math.ceil()方法取無條件進位
  let totalPages = Math.ceil(amount / MOVIE_PER_PAGE);
  let paginationHtml = "";

  for (i = 0; i < totalPages; i++) {
    paginationHtml += `<li class="page-item"><a class="page-link"  data-page=${
      i + 1
    } href="#">${i + 1}</a></li>`;
  }
  paginator.innerHTML = paginationHtml;
}

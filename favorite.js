const BASE_URL = "https://webdev.alphacamp.io";
//宣告變數
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

//宣告變數
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

//監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (".btn-remove-favorite") {
    console.log(event.target.dataset.id);
    removeFromFaroiateMovie(Number(event.target.dataset.id));
  }
});

//removeFromFavroiateMovie方法
function removeFromFaroiateMovie(id) {
  //一旦傳入的 id 在收藏清單中不存在則return
  if (!favoriteMovies || !favoriteMovies.length) return;

  //使用target的id，去找尋localStorage的電影資料索引位置
  const movieIndex = favoriteMovies.findIndex((favoriteMovie) => {
    return favoriteMovie.id === id;
  });
  //找不到movieIndex 則return
  if (movieIndex === -1) return;
  //使用splice修改原陣列電影資料藉由查尋到的索引位置
  favoriteMovies.splice(movieIndex, 1);
  console.log(favoriteMovies);
  //儲存修改好的電影資料儲存回localStorage
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  console.log(JSON.parse(localStorage.getItem("favoriteMovies")));
  //重新即時render畫面
  renderMovieList(favoriteMovies);
}

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
              <button class="btn btn-danger btn-remove-favorite" type="button" data-id=${
                item.id
              }>x</button>
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

renderMovieList(favoriteMovies);

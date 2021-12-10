import axios from "axios";

const paginationWrapper = document.querySelector(".pagination");
const postListWrapper = document.querySelector(".list-unstyled");
const perPageCount = 10;

const getContent = (start, end, stopPagination = false) => {
  axios
    .get(`http://localhost:3000/post?_start=${start}&_end=${end}`)
    .then((res) => {
      const totalCount = res.headers["x-total-count"];

      const countPaginationNum = Math.floor(totalCount / perPageCount);
      renderPostList(res.data);
      if(!stopPagination){
          renderPagination(countPaginationNum);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

getContent(0, 10, false);

const renderPostList = (postList) => {
  postListWrapper.innerHTML = "";

  postList.forEach((postItems, i) => {
    const postListItem = document.createElement("li");
    postListItem.classList.add("media");
    postListItem.classList.add("mt-2");

    const postBody = document.createElement("div");
    const header = document.createElement("h5");
    header.classList.add("mt-0");
    header.classList.add("mb-1");
    header.innerHTML = postItems.title + postItems.id;
    postBody.appendChild(header);

    const bodyContent = document.createElement("div");
    bodyContent.innerHTML = postItems.body;
    postBody.appendChild(bodyContent);

    postListItem.appendChild(postBody);
    postListWrapper.appendChild(postListItem);
  });
};

const renderPagination = (countPaginationNum) => {
  paginationWrapper.innerHTML = "";
  for (var i = 0; i < countPaginationNum; i++) {
    const anchor = document.createElement("a");
    anchor.classList.add("page-link");
    anchor.setAttribute("href", "#");
    const count = i + 1;
    anchor.innerHTML = count;

    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");

    if(i === 0){
        pageItem.classList.add("active");
    }

    pageItem.addEventListener("click", (e) => {
        const end = count * perPageCount;
        const start = end - perPageCount;

        getContent(start, end, true);

        // remove all active class
        Array.from(paginationWrapper.querySelectorAll("li")).forEach((listItem) => {
            listItem.classList.remove("active");
        })

        pageItem.classList.add("active")
    })

    pageItem.appendChild(anchor);

    paginationWrapper.appendChild(pageItem);
  }
};

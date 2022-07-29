const mainList = document.querySelector(".main-list");
const searchInput = document.querySelector(".search-bar");
const clearButton = document.querySelector(".clear-button");
const searchButton = document.querySelector(".search-button");
const queryParams = new URLSearchParams(window.location.search);

const initialRequest = () => {
  searchInput.value = queryParams.get("searchName");
  const getAllUsers = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    renderUsersList(data);
  };

  getAllUsers();
};

initialRequest();

const getUser = async (userId) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  const data = await response.json();
  renderUsersList([data]);
};

const renderUsersList = (userData) => {
  let template = null;

  if (!userData?.length) {
    template = `<p>No Users Lists</p>`;
  }

  template = userData?.map((user) => {
    const { address } = user;
    return `<li id=${user.id}>
        <div class="user-card">
            <p><b>Name:</b> <span>${user.name}</span></p>
            <p><b>Email:</b> <span>${user.email}</span></p>
            <p><b>Phone number:</b> <span>${user.phone}</span></p>
            <p><b>Website:</b> <span>${user.website}</span></p>
            <p><b>Address:</b> <span>${address?.city}, ${address?.street} ${address?.suite}, ${address?.zipcode}</span></p>
        </div>
    </li>`;
  });
  mainList.innerHTML = template.join("");
};

searchInput.addEventListener("change", function (e) {
  const inputValue = e.target.value.trim();
  queryParams.set("searchName", inputValue);

  if (history.pushState && inputValue.length >= 3) {
    const newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      `?searchName=${inputValue}`;
    window.history.pushState({ path: newurl }, "", newurl);
  }
});

searchButton.addEventListener("click", function () {
  const mainItems = document.querySelectorAll(".main-list > li");
  const searchName = queryParams.get("searchName").toLowerCase();
  let userId = null;

  mainItems.forEach((user) => {
    const textContent = user.textContent.toLowerCase();
    userId = !!textContent.includes(searchName) ? user.id : null;
    if (userId && searchName.length >= 3) getUser(userId);
  });
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  window.location.search = "";
});

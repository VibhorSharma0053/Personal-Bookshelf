document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const bookshelf = document.getElementById("bookshelf");

  const fetchBooks = async (query) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${query}&limit=10&page=1`
      );
      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  };

  const renderBookCard = (book, addButton = false) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${
          book.author_name ? book.author_name.join(", ") : "Unknown"
        }</p>
        <p>First Published: ${book.first_publish_year || "N/A"}</p>
      `;
    if (addButton) {
      const addButton = document.createElement("button");
      addButton.innerText = "Add to Bookshelf";
      addButton.addEventListener("click", () => addToBookshelf(book));
      bookCard.appendChild(addButton);
    }
    return bookCard;
  };

  const addToBookshelf = (book) => {
    const savedBookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    savedBookshelf.push(book);
    localStorage.setItem("bookshelf", JSON.stringify(savedBookshelf));
    renderBookshelf();
  };

  const renderBookshelf = () => {
    const savedBookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    bookshelf.innerHTML = "";
    savedBookshelf.forEach((book) => {
      const bookCard = renderBookCard(book);
      bookshelf.appendChild(bookCard);
    });
  };

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query.length === 0) {
      searchResults.innerHTML = "";
      return;
    }

    const books = await fetchBooks(query);
    searchResults.innerHTML = "";
    books.forEach((book) => {
      const bookCard = renderBookCard(book, true);
      searchResults.appendChild(bookCard);
    });
  });

  // Initial render of the bookshelf
  renderBookshelf();
});

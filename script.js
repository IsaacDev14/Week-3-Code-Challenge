// Base URL for the JSON server
const BASE_URL = "http://localhost:3000/films";

// DOM elements
const moviePoster = document.getElementById("poster");
const movieTitle = document.getElementById("title");
const movieRuntime = document.getElementById("runtime");
const movieShowtime = document.getElementById("showtime");
const movieTickets = document.getElementById("tickets");
const movieDescription = document.getElementById("description");
const buyTicketBtn = document.getElementById("buy-ticket");
const deleteMovieBtn = document.getElementById("delete-movie");
const moviesList = document.getElementById("films");

// Fetch and display movies
function fetchMovies() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(movies => {
            moviesList.innerHTML = ""; // Clear existing movies
            movies.forEach(movie => addMovieToList(movie));
            displayMovieDetails(movies[0]); // Show first movie by default
        })
        .catch(error => console.error("Error fetching movies:", error));
}

// Add movie to sidebar list
function addMovieToList(movie) {
    const li = document.createElement("li");
    li.textContent = movie.title;
    li.classList.add("film", "item");

    // Add "sold-out" class if no tickets are available
    if (movie.capacity - movie.tickets_sold <= 0) {
        li.classList.add("sold-out");
    }

    li.addEventListener("click", () => displayMovieDetails(movie));

    moviesList.appendChild(li);
}

// Display selected movie details
function displayMovieDetails(movie) {
    moviePoster.src = movie.poster;
    movieTitle.textContent = movie.title;
    movieRuntime.textContent = `Runtime: ${movie.runtime} mins`;
    movieShowtime.textContent = `Showtime: ${movie.showtime}`;
    movieDescription.textContent = movie.description;
    
    // Calculate available tickets
    const availableTickets = movie.capacity - movie.tickets_sold;
    movieTickets.textContent = `Available Tickets: ${availableTickets}`;

    // Disable "Buy Ticket" button if sold out
    if (availableTickets <= 0) {
        buyTicketBtn.textContent = "Sold Out";
        buyTicketBtn.disabled = true;
    } else {
        buyTicketBtn.textContent = "Buy Ticket";
        buyTicketBtn.disabled = false;
    }

    // Update Buy Ticket button event
    buyTicketBtn.onclick = () => buyTicket(movie);

    // Update Delete Movie button event
    deleteMovieBtn.onclick = () => deleteMovie(movie.id);
}

// Buy a ticket
function buyTicket(movie) {
    if (movie.capacity - movie.tickets_sold <= 0) return;

    movie.tickets_sold += 1;
    updateMovie(movie);
}

// Update movie details on the server
function updateMovie(movie) {
    fetch(`${BASE_URL}/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets_sold: movie.tickets_sold })
    })
    .then(response => response.json())
    .then(updatedMovie => displayMovieDetails(updatedMovie))
    .catch(error => console.error("Error updating movie:", error));
}

// Delete a movie
function deleteMovie(movieId) {
    fetch(`${BASE_URL}/${movieId}`, { method: "DELETE" })
        .then(() => {
            document.getElementById("films").innerHTML = ""; // Clear list
            fetchMovies(); // Refresh movie list
        })
        .catch(error => console.error("Error deleting movie:", error));
}

// Add new movie
document.getElementById("add-movie-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById("new-title").value,
        runtime: document.getElementById("new-runtime").value,
        showtime: document.getElementById("new-showtime").value,
        capacity: document.getElementById("new-capacity").value,
        description: document.getElementById("new-description").value,
        poster: document.getElementById("new-poster").value,
        tickets_sold: 0
    };

    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
    .then(response => response.json())
    .then(movie => {
        addMovieToList(movie); // Add to UI
        alert("Movie added successfully!");
        document.getElementById("add-movie-form").reset(); // Clear form
    })
    .catch(error => console.error("Error adding movie:", error));
});

// Initial load
fetchMovies();

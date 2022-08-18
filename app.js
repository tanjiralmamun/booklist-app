// Book Class: Represents a book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach( book => UI.addBookToList( book ) );
    }

    static addBookToList(item){
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(targetElement){
        if(targetElement.classList.contains('delete')){
            targetElement.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const alertDiv = document.createElement( 'div' );
        alertDiv.classList = `alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(message));

        // Insert Alert before form
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore( alertDiv, form );

        // Disappear Alert
        setTimeout( () => {
            document.querySelector( '.alert' ).remove();
        }, 2000 )
    }

    static clearFields(){
        document.getElementById( 'title' ).value = '';
        document.getElementById( 'author' ).value = '';
        document.getElementById( 'isbn' ).value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks(){
        let books;
        if( localStorage.getItem('books') == null ){
            books = [];
        } else {
            books = JSON.parse( localStorage.getItem( 'books' ) );
        }

        return books;
    }

    static addBook( book ){
        const books = Store.getBooks();
        books.push( book );
        localStorage.setItem( 'books', JSON.stringify(books) );
    }

    static removeBook( isbn ){
        const books = Store.getBooks();

        books.forEach( ( book, index ) => {
            if( book.isbn === isbn ){
                books.splice( index, 1 );
            }
        } )

        localStorage.setItem( 'books', JSON.stringify(books) );
    }
}

// Event: Display Books
document.addEventListener( 'DOMContentLoaded', UI.displayBooks );

// Event: Add a Book
document.getElementById('book-form').addEventListener( 'submit', submitABook );
function submitABook( e ){
    e.preventDefault();

    // Get form values
    const title = document.getElementById( 'title' ).value;
    const author = document.getElementById( 'author' ).value;
    const isbn = document.getElementById( 'isbn' ).value;

    // Form validation
    if( title == '' || author == '' || isbn == ''){
        UI.showAlert( 'Please fill all fields', 'danger' )
    } else {

        // Instantiate Book
        const intBook = new Book( title, author, isbn );

        // Add book to list
        UI.addBookToList( intBook );

        // Store book to LocalStorage
        Store.addBook( intBook );

        // Show success message
        UI.showAlert( 'Book Added', 'success' );

        // Clear form fields
        UI.clearFields();

    }
}

// Event: Remove a Book
document.getElementById( 'book-list' ).addEventListener( 'click', removeABook );
function removeABook(e){
    UI.deleteBook(e.target);

    // Remove/Splice from LocalStorage
    Store.removeBook( e.target.parentElement.previousElementSibling.textContent );

    // Show removed book info message
    UI.showAlert( 'Book Removed', 'info' );

}
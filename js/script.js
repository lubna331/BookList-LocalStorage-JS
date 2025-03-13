let form = document.querySelector('#book-form')
let bookList = document.querySelector('#book-list')

// BOOK class
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class to display added books

class UI{

    static addToBookList(book){
        let list = document.querySelector('#book-list')
        let row = document.createElement('tr')
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="delete">X</a></td>`;
        list.appendChild(row);
    }

    static clearFields() {
    document.querySelector('#title').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#isbn').value = "";
    }

    static showAlert(message, className){
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)
    }

    static deleteFromBook(target){
        if(target.hasAttribute('href')){
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            UI.showAlert("Book Removed!", "success");
        }
    }
}

// Local Storage class

class Store{
    static getBook(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        let books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks(){
        let books = Store.getBook();

        books.forEach(book => {
            UI.addToBookList(book);
        });
    }

    static removeBook(isbn){
        let books = Store.getBook();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// add event listner
form.addEventListener('submit', newBook)
bookList.addEventListener('click', deleteBook)
document.addEventListener('DOMContentLoaded', Store.displayBooks())

// define function

function newBook(e) {
    let title = document.querySelector('#title').value;
    author = document.querySelector('#author').value;
    isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert("All Fields are required!", "error");
    }
    else{
        let book = new Book(title,author,isbn);   
        UI.addToBookList(book);   
        UI.clearFields();  
        UI.showAlert("Book added!", "success"); 
        Store.addBook(book);
    }
    
    e.preventDefault();
}


// Delete book

function deleteBook(e) {
    UI.deleteFromBook(e.target);

    e.preventDefault();
}
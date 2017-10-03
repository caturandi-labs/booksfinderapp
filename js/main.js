
// const API_KEY = '4fa073a0ab836ece9783740cfd613b8f';

$(document).ready(function(){
	$('body').on('submit', '#searchForm', function(e){
		let searchText = $('#searchText').val();
		getBooks(searchText);
		e.preventDefault();
	});

});


$(document).on('pagebeforeshow', '#book',()=>{
	let bookId = sessionStorage.getItem('bookId');
	getBook(bookId);
});

//fungsi ketika item buku diklik
function bookClicked(id){
	//simpan data item pada session storage dengan key dan val id
	sessionStorage.setItem('bookId', id);
	//handling ketika halaman berpindah
	$.mobile.changePage('movie.html');
}


//Get books from API
function getBooks(searchText){
	loading('show');
	$.ajax({
		method: "GET",
		url: `https://www.googleapis.com/books/v1/volumes?q=${searchText}`
	}).done(function(data){
		let books = data.items;
		let output = '';

		$.each(books, (index, book)=>{
			console.log(book.id);
			output+= `
				<li> 
					<a href="#" onClick="bookClicked('${book.id}')">
						<img src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="" />
						<h2>${book.volumeInfo.title}</h2>
						<p>Tanggal Rilis : <strong>${book.volumeInfo.publishedDate}</strong></p>
						<p>Penerbit : <strong>${book.volumeInfo.publisher}</strong></p>
					</a>
			`;
		});
		$('#books').html(output).listview('refresh');
		loading('hide');
	});
}


//get single movie
function getBook(bookId){
	loading('show');
	$.ajax({
		method: "GET",
		url: `https://www.googleapis.com/books/v1/volumes/${bookId}`
	}).done(function(book){
		let bookTop = `
			<div style="text-align: center">
				<h1>${book.volumeInfo.title}</h1>
				<img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Thumb" />
			</div>
		`;

		let str = '';
		for(i=0; i<book.volumeInfo.authors.length; i++){
			str += book.volumeInfo.authors[i] + ',';
			if(book.volumeInfo.authors == book.volumeInfo.authors.length-1){
				str += book.volumeInfo.authors[i];
			}
		}	

		let bookDetails = `
			<li><strong>Publisher : </strong> ${book.volumeInfo.publisher}</li>
			<li><strong>Published Date : </strong> ${book.volumeInfo.publishedDate}</li>
			<li><strong>Authors : </strong> ${str}</li>
			<li><strong>Jumlah Halaman : </strong> ${book.volumeInfo.pageCount}</li>
			<li class="ui-mini" style="padding:10px;"><strong>Deskripsi : </strong> ${book.volumeInfo.description}</li>
		`;

		$('#bookTop').html(bookTop);
		$('#bookDetails').html(bookDetails).listview('refresh');
		loading('hide');
	});
};

//tampilkan loading image
function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 200); 
}
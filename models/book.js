const db = require("../db");

/** Collection of related methods for books. */
class Book {
  /**
   * Given an isbn, return book data with that isbn:
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * @param {string} isbn - The ISBN of the book to find.
   * @returns {Promise<object>} The book data with the provided ISBN.
   * @throws {Error} Throws an error if no book with the provided ISBN is found.
   */
  static async findOne(isbn) {
    const bookRes = await db.query(
      `SELECT isbn,
              amazon_url,
              author,
              language,
              pages,
              publisher,
              title,
              year
          FROM books 
          WHERE isbn = $1`, [isbn]);

    if (bookRes.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}'`, status: 404 };
    }

    return bookRes.rows[0];
  }

  /**
   * Return array of book data:
   * => [ {isbn, amazon_url, author, language, pages, publisher, title, year}, ... ]
   *
   * @returns {Promise<object[]>} An array of book data.
   */
  static async findAll() {
    const booksRes = await db.query(
      `SELECT isbn,
              amazon_url,
              author,
              language,
              pages,
              publisher,
              title,
              year
          FROM books 
          ORDER BY title`);

    return booksRes.rows;
  }

  /**
   * Create book in database from data, return book data:
   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * @param {object} data - The book data to create.
   * @returns {Promise<object>} The created book data.
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO books (
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING isbn,
                   amazon_url,
                   author,
                   language,
                   pages,
                   publisher,
                   title,
                   year`,
      [
        data.isbn,
        data.amazon_url,
        data.author,
        data.language,
        data.pages,
        data.publisher,
        data.title,
        data.year
      ]
    );

    return result.rows[0];
  }

  /**
   * Update data with matching ISBN to data, return updated book.
   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * @param {string} isbn - The ISBN of the book to update.
   * @param {object} data - The updated book data.
   * @returns {Promise<object>} The updated book data.
   * @throws {Error} Throws an error if no book with the provided ISBN is found.
   */
  static async update(isbn, data) {
    const result = await db.query(
      `UPDATE books SET 
            amazon_url=($1),
            author=($2),
            language=($3),
            pages=($4),
            publisher=($5),
            title=($6),
            year=($7)
            WHERE isbn=$8
        RETURNING isbn,
                  amazon_url,
                  author,
                  language,
                  pages,
                  publisher,
                  title,
                  year`,
      [
        data.amazon_url,
        data.author,
        data.language,
        data.pages,
        data.publisher,
        data.title,
        data.year,
        isbn
      ]
    );

    if (result.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}'`, status: 404 };
    }

    return result.rows[0];
  }

  /**
   * Remove book with matching ISBN. Returns undefined.
   *
   * @param {string} isbn - The ISBN of the book to remove.
   * @returns {Promise<void>} Promise indicating the completion of the operation.
   * @throws {Error} Throws an error if no book with the provided ISBN is found.
   */
  static async remove(isbn) {
    const result = await db.query(
      `DELETE FROM books 
         WHERE isbn = $1 
         RETURNING isbn`,
        [isbn]);

    if (result.rows.length === 0) {
      throw { message: `There is no book with an isbn '${isbn}'`, status: 404 };
    }
  }
}

module.exports = Book;

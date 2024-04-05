process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let items = require("../db")

let item = { isbn: "0691161518", amazon_url: "http://a.co/eobPtX2", author:"Matthew Lane", language:"english", pages: "264",
publisher: "Princeton University Press", title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
year: 2017}

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /books", function () {
    test("Gets a list of books", async function () {
      const response = await request(app).get("/books");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.books)).toBe(true);
    });
});

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /books/:isbn", function () {
    test("Gets a single item", async function () {
      const response = await request(app).get("/books/1234567890");
      expect(response.statusCode).toBe(200);
      expect(response.body.book).toBeDefined();
    });
  
    test("Responds with 404 if can't find book", async function () {
      const response = await request(app).get("/books/0");
      expect(response.statusCode).toBe(404);
    });
});

/** POST /items - create item from data; return `{item: item}` */

describe("POST /books", () => {
    test("Creates a new book", async () => {
      const newBook = {
        isbn: "1234567890",
        amazon_url: "",
        author: "Matthew Lane",
        language: "english",
        pages: "264",
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      };
  
      const response = await request(app)
        .post("/books")
        .send(newBook);
  
      expect(response.statusCode).toBe(201);
      expect(response.body.book).toMatchObject(newBook);
    });
  
    test("Responds with 400 if request data is invalid", async () => {
      const invalidBookData = {
        // Missing required fields like 'isbn', 'title', etc.
      };
  
      const response = await request(app)
        .post("/books")
        .send(invalidBookData);
  
      expect(response.statusCode).toBe(400);
    });
  
    test("Responds with 500 if there is an internal server error", async () => {
      // Mocking an internal server error in the route handler
      jest.spyOn(Book, "create").mockImplementationOnce(() => {
        throw new Error("Internal server error");
      });
  
      const newBook = {
        isbn: "1234567890",
        amazon_url: "",
        author: "Matthew Lane",
        language: "english",
        pages: "264",
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017,
      };
  
      const response = await request(app)
        .post("/books")
        .send(newBook);
  
      expect(response.statusCode).toBe(500);
  
      // Restore the original implementation of Book.create()
      Book.create.mockRestore();
    });
  });
  

/** PUT /items/[name] - update item; return `{item: item}` */

describe("PUT /books/:isbn", function () {
    test("It should update an existing book", async () => {
        const updatedBookData = {
          title: "Updated Book Title",
          // Add other properties to update
        };
    
        // Assuming there's a book with ISBN "1234567890" in your database
        const response = await request(app)
          .put("/books/1234567890")
          .send(updatedBookData);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.book.title).toBe(updatedBookData.title);
        // Add other expectations for updated properties
      });
  
    test("Responds with 404 if can't find book", async function () {
      const response = await request(app).put(`/books/999`);
      expect(response.statusCode).toBe(404);
    });
  });
  // end

/** DELETE /items/[name] - delete item, 
 *  return `{message: "item deleted"}` */

describe("DELETE /books/:isbn", function () {
    test("Deletes a single a books", async function () {
      const response = await request(app).delete("/books/1234567890");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Book deleted");
  });

  test("It should respond with 404 if the book is not found", async () => {
    const response = await request(app).delete("/books/999"); // Assuming ISBN "999" doesn't exist
    expect(response.statusCode).toBe(404);
  });
});
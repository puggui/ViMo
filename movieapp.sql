DROP DATABASE IF EXISTS movieapp;
CREATE DATABASE IF NOT EXISTS movieapp DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE movieapp;

CREATE TABLE User (
	USER_EMAIL varchar(320) NOT NULL,
	USER_PSWD_HASH varchar(60) NOT NULL,
    USER_NAME varchar(100) NOT NULL,
    USER_ISADMIN BOOLEAN DEFAULT FALSE,
	CONSTRAINT PK_EMAIL PRIMARY KEY (USER_EMAIL)
);

INSERT INTO User (USER_EMAIL, USER_PSWD_HASH, USER_NAME, USER_ISADMIN) VALUES
("admin@gmail.com", "$2b$10$Y6U4fJ/3UvMeldCEPEEI1uWSL7QGjm5DaqS5ohVTtawt4jeVPn6YG", "admin", TRUE),
("pugi@gmail.com", "$2b$10$Y6U4fJ/3UvMeldCEPEEI1uWSL7QGjm5DaqS5ohVTtawt4jeVPn6YG", "pUgi", FALSE);

-- Cart table
CREATE TABLE Cart (
  cart_id VARCHAR(8) NOT NULL,
  user_email varchar(320),
  FOREIGN KEY (user_email) REFERENCES User(USER_EMAIL),
  CONSTRAINT PK_Cart PRIMARY KEY (cart_id)
);

INSERT INTO Cart (cart_id) VALUES 
("86d1a7c4");

-- CartItems table
CREATE TABLE CartItems (
  item_entry_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- renamed 'id' for clarity
  cart_id VARCHAR(8) NOT NULL, -- matched type and name to Cart table
  item_id varchar(30) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT FK_CartItems_Cart FOREIGN KEY (cart_id) REFERENCES Cart(cart_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO CartItems (cart_id, item_id, quantity) VALUES 
("86d1a7c4", "tt0096283", 1),
("86d1a7c4", "tt0110912", 1);

CREATE TABLE Movie (
	MOVIE_ID varchar(30) NOT NULL,
	MOVIE_TITLE varchar(100) NOT NULL,
	MOVIE_DIRECTOR varchar(100) NOT NULL,
    MOVIE_GENRE varchar(30) NOT NULL,
    MOVIE_YEAR int NOT NULL,
    MOVIE_AVAILABLE int NOT NULL,
    MOVIE_POSTER varchar(320) NOT NULL,
    MOVIE_PLOT varchar(500) NOT NULL,
    MOVIE_FILENAME varchar(320),
    MOVIE_PRICE DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
	CONSTRAINT PK_MOVIE_ID PRIMARY KEY (MOVIE_ID)
);

INSERT INTO Movie 
(MOVIE_ID, MOVIE_TITLE, MOVIE_DIRECTOR, MOVIE_GENRE, MOVIE_YEAR, MOVIE_AVAILABLE, MOVIE_POSTER, MOVIE_PLOT, MOVIE_PRICE) 
VALUES 
("tt0096283", "My Neighbor Totoro", "Hayao Miyazaki", "Animation", 1988, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744041345/MoviePoster/ol8fafmsd8liozijemny.jpg", "Two young sisters move to the countryside, where they discover magical creatures and form a bond with a forest spirit known as Totoro.", 8.99),
("tt0245429", "Spirited Away", "Hayao Miyazaki", "Animation", 2001, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1743403610/MoviePoster/zfgxkupygnjbfmpg27ck.jpg", "A young girl navigates a mysterious and magical world after her parents are transformed into pigs.", 9.99),
("tt2094016", "Kiki's Delivery Service", "Hayao Miyazaki", "Animation", 1989, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744041914/MoviePoster/ooludrbns1ytwfkmnd8p.jpg", "A young witch sets off on her own and starts a delivery service while discovering herself.", 7.99),
("tt0119698", "Princess Mononoke", "Hayao Miyazaki", "Animation", 1997, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744041999/MoviePoster/princess-mononoke_j4ptje.jpg", "A young man becomes embroiled in a conflict between the industrial revolution and the gods of nature.", 9.49),
("tt0347149", "Howl's Moving Castle", "Hayao Miyazaki", "Animation", 2004, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042123/MoviePoster/howls-moving-castle_my2rj7.jpg", "A young woman is transformed into an old lady by a witch's curse and seeks refuge in a wizard's moving castle.", 8.49),
("tt0111161", "The Shawshank Redemption", "Frank Darabont", "Drama", 1994, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744041750/MoviePoster/kprrstvntvvceh9ljuvq.jpg", "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", 9.99),
("tt0133093", "The Matrix", "Lana Wachowski, Lilly Wachowski", "Sci-Fi", 1999, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042003/MoviePoster/the-matrix_b7wclv.jpg", "A computer hacker learns that reality is not what it seems and is drawn into a battle to free humanity from a simulated reality controlled by machines.", 10.49),
("tt0110912", "Pulp Fiction", "Quentin Tarantino", "Crime", 1994, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042017/MoviePoster/pulp-fiction_figxte.jpg", "The lives of several criminals intersect in a non-linear tale of violence, redemption, and quirky characters in Los Angeles.", 9.99),
("tt0468569", "The Dark Knight", "Christopher Nolan", "Action", 2008, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042278/MoviePoster/the-dark-knight_n4vhxp.jpg", "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham into anarchy and test Batman's limits as a hero.", 11.49),
("tt1375666", "Inception", "Christopher Nolan", "Sci-Fi", 2010, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042361/MoviePoster/inception_tfr73h.jpg", "A skilled thief, who can enter others' dreams and steal secrets, is tasked with planting an idea into a target's mind, a process known as inception.", 10.99),
("tt0088763", "Back to the Future", "Robert Zemeckis", "Adventure", 1985, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744041482/MoviePoster/tsh8uuip61kvgqyvizwt.jpg", "A teenager travels back in time in a DeLorean to meet his young parents and ensure his existence, all while trying to return to the present.", 8.99),
("tt0816692", "Interstellar", "Christopher Nolan", "Sci-Fi", 2014, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042282/MoviePoster/interstellar_mwsfql.jpg", "A team of astronauts travels through a wormhole in search of a new home for humanity, as Earth faces environmental collapse.", 11.49),
("tt1345836", "The Dark Knight Rises", "Christopher Nolan", "Action", 2012, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042277/MoviePoster/the-dark-knight-rises_xqtu7c.jpg", "Eight years after Batman disappeared, a new foe known as Bane emerges, and Gotham must confront its greatest challenges.", 11.49),
("tt0144084", "American Psycho", "Mary Harron", "Thriller", 2000, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042719/MoviePoster/bateman_eu3y4p.jpg", "A wealthy New York investment banking executive hides his alternate psychopathic ego from his friends as he delves deeper into violent, hedonistic fantasies.", 8.49),
("tt10638522", "Talk to Me", "Danny Philippou & Michael Philippou", "Horror", 2022, 1, "https://res.cloudinary.com/de3tvsweh/image/upload/v1744042724/MoviePoster/talk-to-me_axapdo.jpg", "A group of friends discover how to conjure spirits using a mysterious embalmed hand, but things spiral out of control when one of them opens the door to the spirit world for too long.", 9.49);

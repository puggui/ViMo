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
("admin@gmail.com", "$2b$10$Y6U4fJ/3UvMeldCEPEEI1uWSL7QGjm5DaqS5ohVTtawt4jeVPn6YG", "admin", TRUE);

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
	CONSTRAINT PK_MOVIE_ID PRIMARY KEY (MOVIE_ID)
);

INSERT INTO Movie (MOVIE_ID, MOVIE_TITLE, MOVIE_DIRECTOR, MOVIE_GENRE, MOVIE_YEAR, MOVIE_AVAILABLE, MOVIE_POSTER, MOVIE_PLOT) VALUES 
("tt0096283", "My Neighbor Totoro", "Hayao Miyazaki", "Animation", 1988, 1, "/placeholder-poster.jpg", "Two young sisters move to the countryside, where they discover magical creatures and form a bond with a forest spirit known as Totoro."),
("tt0110357", "The Lion King", "Roger Allers, Rob Minkoff", "Animation", 1994, 1, "/placeholder-poster.jpg", "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery as he prepares to take his rightful place as king."),
("tt0137523", "Fight Club", "David Fincher", "Drama", 1999, 1, "/placeholder-poster.jpg", "An insomniac office worker forms an underground fight club with a soap salesman, leading to a radical philosophy that turns his world upside down."),
("tt0109830", "Forrest Gump", "Robert Zemeckis", "Drama", 1994, 1, "/placeholder-poster.jpg", "The life story of Forrest Gump, a man of limited intelligence but great kindness and a witness to many of the major events of the 20th century in the U.S."),
("tt0120737", "The Lord of the Rings: The Fellowship of the Ring", "Peter Jackson", "Adventure", 2001, 1, "/placeholder-poster.jpg", "A young hobbit, Frodo, embarks on a quest to destroy the One Ring, an evil artifact that could bring power and destruction to the world."),
("tt0167260", "The Lord of the Rings: The Two Towers", "Peter Jackson", "Adventure", 2002, 1, "/placeholder-poster.jpg", "Frodo and Sam continue their journey to Mordor to destroy the One Ring, while Aragorn, Legolas, and Gimli try to defend the kingdom of Rohan from Sauron's forces."),
("tt0167261", "The Lord of the Rings: The Return of the King", "Peter Jackson", "Adventure", 2003, 1, "/placeholder-poster.jpg", "Frodo and Sam are joined by their companions in a final battle to destroy the One Ring and defeat the forces of darkness led by Sauron."),
("tt0133093", "The Matrix", "Lana Wachowski, Lilly Wachowski", "Sci-Fi", 1999, 1, "/placeholder-poster.jpg", "A computer hacker learns that reality is not what it seems and is drawn into a battle to free humanity from a simulated reality controlled by machines."),
("tt0110912", "Pulp Fiction", "Quentin Tarantino", "Crime", 1994, 1, "/placeholder-poster.jpg", "The lives of several criminals intersect in a non-linear tale of violence, redemption, and quirky characters in Los Angeles."),
("tt0068646", "The Godfather", "Francis Ford Coppola", "Crime", 1972, 1, "/placeholder-poster.jpg", "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."),
("tt0468569", "The Dark Knight", "Christopher Nolan", "Action", 2008, 1, "/placeholder-poster.jpg", "Batman faces the Joker, a criminal mastermind who seeks to plunge Gotham into anarchy and test Batman's limits as a hero."),
("tt1375666", "Inception", "Christopher Nolan", "Sci-Fi", 2010, 1, "/placeholder-poster.jpg", "A skilled thief, who can enter others' dreams and steal secrets, is tasked with planting an idea into a target's mind, a process known as inception."),
("tt0088763", "Back to the Future", "Robert Zemeckis", "Adventure", 1985, 1, "/placeholder-poster.jpg", "A teenager travels back in time in a DeLorean to meet his young parents and ensure his existence, all while trying to return to the present."),
("tt0816692", "Interstellar", "Christopher Nolan", "Sci-Fi", 2014, 1, "/placeholder-poster.jpg", "A team of astronauts travels through a wormhole in search of a new home for humanity, as Earth faces environmental collapse."),
("tt1345836", "The Dark Knight Rises", "Christopher Nolan", "Action", 2012, 1, "/placeholder-poster.jpg", "Eight years after Batman disappeared, a new foe known as Bane emerges, and Gotham must confront its greatest challenges."),
("tt0114369", "Se7en", "David Fincher", "Thriller", 1995, 1, "/placeholder-poster.jpg", "Two detectives track a serial killer who uses the seven deadly sins as his modus operandi, leading to a shocking and unforgettable conclusion."),
("tt0993846", "The Wolf of Wall Street", "Martin Scorsese", "Biography", 2013, 1, "/placeholder-poster.jpg", "The story of Jordan Belfort, a stockbroker who rises to wealth and power through unethical and illegal practices before facing the consequences."),
("tt1853728", "Django Unchained", "Quentin Tarantino", "Western", 2012, 1, "/placeholder-poster.jpg", "A freed slave partners with a bounty hunter to rescue his wife from a brutal plantation owner, engaging in a violent and action-packed showdown."),
("tt0118799", "Life Is Beautiful", "Roberto Benigni", "Drama", 1997, 1, "/placeholder-poster.jpg", "A Jewish-Italian man uses his imagination to protect his son from the horrors of a Nazi concentration camp, turning their suffering into a game."),
("tt0172495", "Gladiator", "Ridley Scott", "Action", 2000, 1, "/placeholder-poster.jpg", "A betrayed Roman general seeks revenge on the emperor who murdered his family and sent him into slavery, rising through the ranks as a gladiator.");
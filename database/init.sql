-- CREATE DATABASE gifts; --

Use gifts; 

DROP TABLE IF EXISTS requests;

CREATE TABLE requests (
	id INT auto_increment,
    receiverName VARCHAR(255),
    gender VARCHAR (25),
    age INT,
    street VARCHAR (255),
    city VARCHAR (255),
    state VARCHAR (25),
    zip VARCHAR(10),
    gift VARCHAR (255),
    link VARCHAR (255),
    timestamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (id)
    );
    
    
const express = require('express');
const mariadb = require('mariadb');

require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function connect() {
    try {
        const conn = await pool.getConnection();
         console.log('connected to the database');
         return conn; 
    } catch (err){
        console.log('Error connecting to the database: ' + err)
    }

}


const app = express();

app.use(express.urlencoded({extended:false}));

app.use (express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
    console.log("home webpage working");
    res.render('home');
});

app.get('/register', (req,res) => {
    console.log("register page working");
    res.render('register', {data:{}, errors:[]});
});


app.post('/success', async (req,res) => {
    

    const data = req.body;
    let isValid = true;

    let errors = [];
    console.log(data);
    

    if (data.name.trim()=== ''){
        isValid = false;
        errors.push('name is required');
    }

    if (data.gender == 'none'){
        isValid = false;
        errors.push('Gender selection required');
    }

    if (data.street.trim()=== ''){
        isValid = false;
        errors.push('Street address is required');
    }

    if (data.city.trim()=== ''){
        isValid = false;
        errors.push('City is required');
    }

    if (data.state == 'none'){
        isValid = false;
        errors.push('State selection is required');
    }


    if (data.gift.trim()=== ''){
        isValid = false;
        errors.push('Please provide requested gift');
    }

    if (data.zip.trim()=== ''){
        isValid = false;
        errors.push('Please provide a zip 5 digit zip code');
    }

    if (!isValid) {
        res.render ('register', {data:data, errors: errors});
        return;
    }

    if (data.gift.trim()=== ''){
        isValid = false;
        errors.push('Please provide requested gift');
    }

    const conn = await connect();

    conn.query(`
        INSERT INTO requests(
            receiverName,
            gender,
            age,
            street,
            city,
            state,
            zip,
            gift,
            link
        )
        VALUES (
            '${data.name}',
            '${data.gender}',
            '${data.age}',
            '${data.street}',
            '${data.city}',
            '${data.state}',
            '${data.zip}',
            '${data.gift}',
            '${data.link}'
        );
    `);

    res.render('wish', {details: data});
});



app.get('/give', async (req, res) => {
    const conn = await connect();

    const rows = await conn.query('SELECT * FROM requests;');
    //console.log (rows);

    res.render('give', {data: rows});

});

app.post('/sort', async (req,res) => {
    const conn = await connect();
    const data = req.body;// test to see info coming from sort

    if (data.sort == 'age'){
    const rows = await conn.query('SELECT * FROM requests ORDER BY age ASC;');
    console.log (rows);

    res.render('give', {data: rows});
    }

    if (data.sort == 'newest'){
        const rows = await conn.query('SELECT * FROM requests ORDER BY timestamp DESC;');
        
        res.render('give', {data: rows});
    }
    
    if (data.sort == 'name'){
        const rows = await conn.query('SELECT * FROM requests ORDER BY receiverName ASC;');
        
        res.render('give', {data: rows});
    }

});
app.get('/give', (req, res) => {
    console.log(confirmations);
    res.render('give', { gifts : gifts });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on http://localhost:${process.env.APP_PORT}`);
});

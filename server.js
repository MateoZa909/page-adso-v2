const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');

// const cors = require('cors'); // Importar el paquete 'cors'

// Middleware para analizar datos JSON en las solicitudes
app.use(bodyParser.json());

// Configura Express para servir archivos estáticos desde un directorio específico
app.use(express.static(__dirname + '/'));

// // Motor de plantilla
// app.set('view engine', 'ejs');

// Var de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// ****************************
// RUTAS
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Ruta de login
// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + '/views/login.html'); 
// });

// Ruta de registro
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/views/registro.html'); 
});

// Ruta para servir index.html en la ruta '/home'
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// ****************************

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

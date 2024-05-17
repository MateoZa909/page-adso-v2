const express = require('express');
// const { engine } = require('express-handlebars');
// const myConnection = require('express-myconnection');
// const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const mysql = require('mysql2');
const cors = require('cors'); // Importar el paquete 'cors'

app.use(cors());
app.use(express.json());

// Middleware para analizar datos JSON en las solicitudes
app.use(bodyParser.json());

// Middleware para analizar datos de formularios en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));  

// Configura Express para servir archivos estáticos desde un directorio específico
app.use(express.static(__dirname + '/'));

// Motor de plantilla
app.set('view engine', 'ejs');

// bcrypt
const bcrypt = require('bcryptjs');

// Var de session
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log(`Conectado a la base de datos MySQL news`);
});

// Endpoint de registro
app.post('/register', (req, res) => {
    const { nombre, apellido, email, contrasena } = req.body;

    // Verifica si el usuario ya existe
    db.query('SELECT * FROM autores WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al verificar el usuario' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 8);

        // Crear el nuevo usuario
        db.query('INSERT INTO autores (nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?)', 
        [nombre, apellido, email, hashedPassword], 
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    });
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, contrasena } = req.body;

    // Buscar al usuario por email
    db.query('SELECT * FROM autores WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al buscar el usuario' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Verificar la contraseña
        const isPasswordValid = bcrypt.compareSync(contrasena, user.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    });
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/login-register', (req, res) => {
    res.render('login-register');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const express = require('express');
// const { engine } = require('express-handlebars');
// const myConnection = require('express-myconnection');
// const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');  // Asegúrate de importar jsonwebtoken

const app = express();
const port = 3002;

const mysql = require('mysql2');
const cors = require('cors'); // Importar el paquete 'cors'
const jwtSecret = 'your_jwt_secret'; // Define una clave secreta para JWT


app.use(cors());
app.use(express.json());

// Middleware para analizar datos JSON en las solicitudes
app.use(bodyParser.json());

// Middleware para analizar datos de formularios en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));  

// Configurar el directorio de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurar el directorio para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
app.post('/register', async (req, res) => {
    const { nombres, nombre_usuario, email, contrasena } = req.body;

    if (!nombres || !nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const [results] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 8);

        // Crear el nuevo usuario
        await db.promise().query('INSERT INTO usuarios (nombres, nombre_usuario, email, contrasena) VALUES (?, ?, ?, ?)', 
        [nombres, nombre_usuario, email, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
        console.log('Registro exitoso');
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        // Buscar al usuario por email
        const [results] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
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
    } catch (err) {
        console.error('Error al buscar el usuario:', err);
        res.status(500).json({ message: 'Error al buscar el usuario' });
    }
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

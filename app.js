const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');  // Import CORS

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Add CORS middleware
app.use(cors({
  origin: 'https://deals-dray-six.vercel.app',  // Allow only frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],   // Allowed methods
  credentials: true,  // Allow cookies/authorization headers
}));

app.use(bodyParser.json());


// JWT Secret Key
const JWT_SECRET = 'your_jwt_secret';

// Middleware for JWT verification
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) return res.sendStatus(403);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.get('/',async(req,res)=>{
  res.json({msg:"Hello"});
})
// Register/Login Routes
app.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  const user = await prisma.login.findUnique({ where: { userName } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userName: user.userName }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/register', async (req, res) => {
  const { userName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.login.create({
      data: { userName, password: hashedPassword },
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).send('User already exists');
  }
});

// Employee CRUD Routes
app.get('/employees', async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

// Update employee
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { image, name, email, mobile, designation, gender, course } = req.body;

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { image, name, email, mobile, designation, gender, course },
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).send('Error updating employee');
  }
});

// create new employee
app.post('/employees', async (req, res) => {
  try {
      const { image, name, email, mobile, designation, gender, courses } = req.body;
      console.log("Received data:", req.body); // Log the received data
      
      const newEmployee = await prisma.employee.create({
          data: { image, name, email, mobile, designation, gender, courses },
      });
      res.json(newEmployee);
  } catch (error) {
      console.error("Error creating employee:", error.message); // Log the error message
      res.status(400).send('Error creating employee: ' + error.message);
  }
});



// Get all employees with filters and sorting
app.post('/employees/filter', async (req, res) => {
  const { filters, search } = req.body;
  const sort = true;
  
  try {
    // Building the where clause dynamically based on filters and search term
    const where = {};

    if (filters) {
      if (filters.Name) {
        where.name = { contains: filters.Name, mode: 'insensitive' }; // Case insensitive search
      }
      if (filters.Email) {
        where.email = { contains: filters.Email, mode: 'insensitive' }; // Case insensitive search
      }
      if (filters.ID) {
        where.id = parseInt(filters.ID); // Assuming ID is an integer
      }
      if (filters.createDate) {
        where.createDate = {
          gte: new Date(filters.createDate), // Assuming createDate is a date string
        };
      }
    }

    // If a search term is provided, include it in the where clause
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Handling sorting
    const orderBy = sort ? { id: 'asc' } : {}; // Example sorting by ID, adjust as needed

    // Query the database with filters and sorting
    const employees = await prisma.employee.findMany({
      where,
      orderBy,
    });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error fetching employees');
  }
});



// Get employee by ID
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!employee) return res.status(404).send('Employee not found');
    
    res.json(employee);
  } catch (error) {
    res.status(400).send('Error fetching employee');
  }
});

// Check if email exists
app.post('/employees/email-check', async (req, res) => {
  const { email } = req.body;

  try {
    const employee = await prisma.employee.findUnique({
      where: { email }
    });

    if (employee) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(400).send('Error checking email');
  }
});

// Delete employee details
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({ where: { id: parseInt(id) } });
    res.sendStatus(204);
  } catch (error) {
    res.status(400).send('Error deleting employee');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


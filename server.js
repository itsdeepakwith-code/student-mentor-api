const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const { Mentor, Student } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Welcome message for the base URL
// Welcome message for the base URL
app.get("/api", (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mentor-Student Assignment System</title>
        <style>
          /* Basic styling for a clean layout */
          body {
            font-family: sans-serif;
            margin: 20px;
          }
          form {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
          }
          label {
            margin-bottom: 5px;
          }
          input,
          select {
            padding: 5px;
            margin-bottom: 10px;
          }
          .results {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 15px;
          }
          .results h3 {
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
      <h1>Welcome to the Mentor-Student API!</h1>
      <h2>Instructions:</h2>
      <p>To run the project:</p>
      <ol>
        <li>Make sure you have Node.js and npm installed on your machine.</li>
        <li>Clone the project repository from GitHub.</li>
        <li>Run 'npm install' to install dependencies.</li>
        <li>Set up your MongoDB connection string in the 'db.js' file.</li>
        <li>Run 'npm start' to start the server.</li>
      </ol>
      <h2>API Queries:</h2>
      <p>1. Create a Mentor:</p>
      <p>POST /api/mentors</p>
      <p>2. Create a Student:</p>
      <p>POST /api/students</p>
      <p>3. Assign a student to Mentor:</p>
      <p>PUT /api/students/:studentId/assign</p>
      <p>List Students without a Mentor</p>
      <p>GET /api/students/unassigned</p>
      <p>4. Assign or Change Mentor for a particular Student:</p>
      <p>PUT /api/students/:studentId/change-mentor</p>
      <p>5. Show all students for a particular mentor:</p>
      <p>GET /api/mentors/:mentorId/students</p>
      <p>6. Show the previously assigned mentor for a particular student:</p>
      <p>GET /api/students/:studentId/previous-mentor</p>
        <h2>Create Mentor</h2>
        <form id="create-mentor-form">
          <label for="mentor-name">Name:</label>
          <input type="text" id="mentor-name" name="name" required />
          <label for="mentor-expertise">Expertise:</label>
          <input type="text" id="mentor-expertise" name="expertise" required />
          <button type="submit">Create Mentor</button>
        </form>
        <h2>Create Student (Assign to Mentor)</h2>
        <form id="create-student-form">
          <label for="student-name">Name:</label>
          <input type="text" id="student-name" name="name" required />
          <label for="mentor-select">Assign to Mentor:</label>
          <select id="mentor-select" name="mentorId" required></select>
          <button type="submit">Create Student</button>
        </form>
    
        <h2>List Students without Mentor</h2>
        <button id="get-unassigned-students">Get Unassigned Students</button>
        <div id="unassigned-students-results" class="results"></div>
    
        <script>
          const baseUrl = 'http://localhost:5000/api'; // Ensure this is your server URL

          // Function to fetch mentors and populate dropdown
          async function fetchMentors() {
            try {
              const response = await fetch(\`\${baseUrl}/mentors\`);
              const mentors = await response.json();
              const mentorSelect = document.getElementById('mentor-select');
              mentorSelect.innerHTML = ''; // Clear previous options
              mentors.forEach(mentor => {
                const option = document.createElement('option');
                option.value = mentor._id;
                option.text = mentor.name;
                mentorSelect.appendChild(option);
              });
            } catch (error) {
              console.error('Error fetching mentors:', error);
            }
          }

          // Function to assign or change mentor for a student
          async function assignMentor(studentId, mentorId) {
            try {
              const response = await fetch(\`\${baseUrl}/students/\${studentId}/mentor\`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mentorId })
              });
              const student = await response.json();
              console.log('Student:', student); // Log the updated student object
            } catch (error) {
              console.error('Error assigning mentor:', error);
            }
          }

          // Function to fetch all students for a particular mentor
          async function fetchStudentsForMentor(mentorId) {
            try {
              const response = await fetch(\`\${baseUrl}/mentors/\${mentorId}/students\`);
              const students = await response.json();
              console.log('Students for mentor:', students); // Log the students for the mentor
            } catch (error) {
              console.error('Error fetching students for mentor:', error);
            }
          }

          // Function to fetch the previously assigned mentor for a student
          async function fetchPreviousMentor(studentId) {
            try {
              const response = await fetch(\`\${baseUrl}/students/\${studentId}/previous-mentor\`);
              const previousMentor = await response.json();
              console.log('Previous mentor:', previousMentor); // Log the previous mentor
            } catch (error) {
              console.error('Error fetching previous mentor:', error);
            }
          }

          // Call fetchMentors on page load
          fetchMentors();

          // Create Mentor form submission
          const createMentorForm = document.getElementById('create-mentor-form');
          createMentorForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('mentor-name').value;
            const expertise = document.getElementById('mentor-expertise').value;

            try {
              const response = await fetch(\`\${baseUrl}/mentors\`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, expertise }),
              });

              if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
              }

              const mentor = await response.json();
              console.log('Mentor created:', mentor);

              // Refresh mentors dropdown
              const mentorSelect = document.getElementById('mentor-select');
              const option = document.createElement('option');
              option.value = mentor._id;
              option.textContent = mentor.name;
              mentorSelect.appendChild(option);

            } catch (error) {
              console.error('Error creating mentor:', error);
            }
          });

          // Create Student form submission
          const createStudentForm = document.getElementById('create-student-form');
          createStudentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('student-name').value;
            const mentorId = document.getElementById('mentor-select').value;

            try {
              const response = await fetch(\`\${baseUrl}/students\`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, mentorId }),
              });

              if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
              }

              const student = await response.json();
              console.log('Student created:', student);
            } catch (error) {
              console.error('Error creating student:', error);
            }
          });

          // Get Unassigned Students button
          const getUnassignedStudentsButton = document.getElementById('get-unassigned-students');
          getUnassignedStudentsButton.addEventListener('click', async () => {
            try {
              const response = await fetch(\`\${baseUrl}/students/unassigned\`);
              if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
              }
              const unassignedStudents = await response.json();

              const unassignedStudentsResults = document.getElementById('unassigned              -students-results');
              unassignedStudentsResults.innerHTML = '';
              unassignedStudents.forEach((student) => {
                const studentDiv = document.createElement('div');
                studentDiv.textContent = student.name;
                unassignedStudentsResults.appendChild(studentDiv);
              });
            } catch (error) {
              console.error('Error fetching unassigned students:', error);
            }
          });
        </script>
      </body>
    </html>
  `;

  res.send(htmlContent);
});

// 1. Create Mentor
app.post("/api/mentors", async (req, res) => {
  try {
    const { name, expertise } = req.body;
    const newMentor = new Mentor({ name, expertise });
    const savedMentor = await newMentor.save();
    res.json(savedMentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. Create Student (Handles assigning to a mentor)
app.post("/api/students", async (req, res) => {
  try {
    const { name, mentorId } = req.body;

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).json({ error: "Mentor not found" });
    }

    const newStudent = new Student({ name });
    newStudent.mentor = mentor; // Assign mentor to student

    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3a. Assign Student to Mentor (Handles adding single student)
app.put("/api/students/:studentId/assign", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { mentorId } = req.body;

    // Check if student and mentor exist
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    if (!student || !mentor) {
      return res.status(400).json({ error: "Student or Mentor not found" });
    }

    // Update student's mentor if it doesn't already have one
    if (!student.mentor) {
      student.mentor = mentor;
      await student.save();
    } else {
      return res.status(400).json({ error: "Student already has a mentor" });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3b. List Students without a Mentor
app.get("/api/students/unassigned", async (req, res) => {
  try {
    const unassignedStudents = await Student.find({ mentor: null });
    res.json(unassignedStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 4. Assign or Change Mentor for a Student
app.put("/api/students/:studentId/change-mentor", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { mentorId } = req.body;

    // Check if student and mentor exist
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    if (!student || !mentor) {
      return res.status(400).json({ error: "Student or Mentor not found" });
    }

    student.mentor = mentor;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 5. Show All Students for a Particular Mentor
app.get("/api/mentors/:mentorId/students", async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 6. Show Previously Assigned Mentor for a Student
app.get("/api/students/:studentId/previous-mentor", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId).populate("mentor");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if student has a previous mentor
    if (!student.mentor) {
      return res.json({ message: "Student has no previous mentor" });
    }

    res.json(student.mentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Potential GET requests endpoints
// Get All Students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find(); // Find all students
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add this endpoint to fetch mentors
app.get("/api/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3c. Assign multiple students to a mentor
app.post("/api/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentNames } = req.body;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).send("Mentor not found");
    }

    const students = await Promise.all(
      studentNames.map(async (name) => {
        const student = new Student({ name, mentor: mentorId });
        return await student.save();
      })
    );

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 4. Assign or change mentor for a particular student
app.put("/api/students/:studentId/mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).send("Student not found");
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(400).send("Mentor not found");
    }

    student.mentor = mentorId;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 5. Show all students for a particular mentor
app.get("/api/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 6. Show the previously assigned mentor for a particular student
app.get("/api/students/:studentId/previous-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).send("Student not found");
    }

    const previousMentor = await Mentor.findById(student.previousMentor);
    res.json(previousMentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get Unassigned Students button
app.get('/api/students/unassigned', async (req, res) => {
  try {
    const unassignedStudents = await Student.find({ mentor: null });
    res.json(unassignedStudents);
  } catch (err) {
    console.error('Error fetching unassigned students:', err);
    res.status(500).send('Server Error');
  }
});



// Add your potential GET request endpoints here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const app = express();
app.use(express.json()); // For parsing application/json

// Endpoint for teacher login
app.post('/login', (req, res) => {
  const { email } = req.body;
  
  // Query to find the teacher's ID using their email
  const queryTeacherID = 'SELECT TeacherID FROM Teachers WHERE Email = ?';

  connection.query(queryTeacherID, [email], (error, results) => {
    if (error) return res.status(500).send('Error on the server.');
    if (results.length > 0) {
      const teacherId = results[0].TeacherID;
      
      // Now that we have the teacher's ID, we can find the classes they're teaching
      const queryClasses = `
        SELECT ClassID, ClassName
        FROM Classes
        WHERE TeacherID = ?
      `;

      connection.query(queryClasses, [teacherId], (error, results) => {
        if (error) return res.status(500).send('Error on the server.');
        // Sending the classes back to the client
        res.json(results);
      });
    } else {
      // If no teacher is found with that email
      res.status(404).send('Teacher not found.');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

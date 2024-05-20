 Access the API at http://localhost:5000/api.

## API Endpoints

The API endpoints are as follows:

- `POST /api/mentors`: Create a new mentor.
- `POST /api/students`: Create a new student and assign to a mentor.
- `PUT /api/students/:studentId/assign`: Assign a student to a mentor.
- `GET /api/students/unassigned`: Get a list of unassigned students.
- `PUT /api/students/:studentId/change-mentor`: Change the mentor for a student.
- `GET /api/mentors/:mentorId/students`: Get all students for a particular mentor.
- `GET /api/students/:studentId/previous-mentor`: Get the previous mentor for a student.

## Contributing

Contributions are welcome! If you find any bugs or have feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

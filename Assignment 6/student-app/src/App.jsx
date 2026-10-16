import { useState } from "react";
import StudentForm from "./StudentForm";
import StudentDetails from "./StudentDetails";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents((prev) => [...prev, student]);
  };

  return (
    <div className="app">
      <h1>Student Information Application</h1>
      <div className="layout">
        <StudentForm onSubmit={addStudent} />
        <StudentDetails students={students} />
      </div>
    </div>
  );
}

export default App;
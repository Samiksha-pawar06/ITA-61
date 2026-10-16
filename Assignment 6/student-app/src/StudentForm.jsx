import { useState } from "react";

const initialState = {
  name: "",
  rollNo: "",
  department: "",
  marks: "",
};

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

function StudentForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll number is required";
    if (!formData.department) newErrors.department = "Select a department";
    if (formData.marks === "") {
      newErrors.marks = "Marks are required";
    } else if (Number(formData.marks) < 0 || Number(formData.marks) > 100) {
      newErrors.marks = "Marks must be between 0 and 100";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      rollNo: formData.rollNo.trim(),
      marks: Number(formData.marks),
    });
    setFormData(initialState);
    setErrors({});
  };

  return (
    <form className="card student-form" onSubmit={handleSubmit} noValidate>
      <h2>Student Registration</h2>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rollNo">Roll Number</label>
        <input
          id="rollNo"
          name="rollNo"
          type="text"
          placeholder="e.g. CS101"
          value={formData.rollNo}
          onChange={handleChange}
        />
        {errors.rollNo && <span className="error">{errors.rollNo}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">-- Select department --</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && <span className="error">{errors.department}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="marks">Marks (out of 100)</label>
        <input
          id="marks"
          name="marks"
          type="number"
          min="0"
          max="100"
          placeholder="e.g. 85"
          value={formData.marks}
          onChange={handleChange}
        />
        {errors.marks && <span className="error">{errors.marks}</span>}
      </div>

      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
}

export default StudentForm;
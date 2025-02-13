// employees.new.tsx

import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

const UPLOAD_URL = "http://localhost:3000/upload";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");

  const profile_picture = formData.get("profile_picture");

  let profilePictureFileName = null;

  if (profile_picture && profile_picture instanceof Blob) {
    const data = new FormData();
    data.append("profile_picture", profile_picture);

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    if (response.ok && result.filename) {
      profilePictureFileName = result.filename;
    }
  }

  const db = await getDB();
  await db.run(
    'INSERT INTO employees (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      full_name,
      email,
      phone_number,
      date_of_birth,
      job_title,
      department,
      salary,
      start_date,
      end_date,
      profilePictureFileName, 
    ]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  return (
    <div>
      <h1>Create New Employee</h1>
      <Form method="post" encType="multipart/form-data">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input type="tel" name="phone_number" id="phone_number" required />
        </div>
        <div>
          <label htmlFor="date_of_birth">Date Of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" required />
        </div>
        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" required />
        </div>
        <div>
          <label htmlFor="salary">Salary</label>
          <input type="number" name="salary" id="salary" required step="0.01" min="0" />
        </div>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input type="date" name="start_date" id="start_date" required />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input type="date" name="end_date" id="end_date"  />
        </div>
        <div>
          <label htmlFor="profile_picture">Profile Picture</label>
          <input type="file" name="profile_picture" id="profile_picture" accept="image/*" />
        </div>
        <button type="submit">Create Employee</button>
      </Form>
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}

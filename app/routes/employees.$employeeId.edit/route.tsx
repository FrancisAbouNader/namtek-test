import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";

export async function loader({ params }: { params: { employeeId?: string } }) {
  const db = await getDB();
  const employeeId = params.employeeId;

  if (!employeeId) {
    throw new Response("Employee ID is required", { status: 400 });
  }

  const employee = await db.get("SELECT * FROM employees WHERE id = ?", employeeId);

  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }

  return { employee };
}

export async function action({ request, params }: { request: Request; params: { employeeId?: string } }) {
  const db = await getDB();
  const employeeId = params.employeeId;

  if (!employeeId) {
    throw new Response("Employee ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  let profilePictureFileName = updates.profile_picture || updates.old_profile_picture;

  // If a new file is uploaded, handle the file upload
  const profile_picture = formData.get("profile_picture");
  if (profile_picture && profile_picture instanceof Blob) {
    // Handle file upload inside the action function
    const data = new FormData();
    data.append("profile_picture", profile_picture);

    // Upload the file to your server
    const uploadResponse = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: data,
    });

    const uploadResult = await uploadResponse.json();
    if (uploadResponse.ok && uploadResult.filename) {
      profilePictureFileName = uploadResult.filename; // Get the filename after upload
    }
  }

  // Update the employee in the database
  await db.run(
    "UPDATE employees SET full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?, profile_picture = ? WHERE id = ?",
    [
      updates.full_name,
      updates.email,
      updates.phone_number,
      updates.date_of_birth,
      updates.job_title,
      updates.department,
      updates.salary,
      updates.start_date,
      updates.end_date,
      profilePictureFileName,  // Use the new file name or the old one
      employeeId,
    ]
  );

  return redirect(`/employees/${employeeId}`);
}

export default function EditEmployeePage() {
  const { employee } = useLoaderData();
  const [imagePreview] = useState(
    employee.profile_picture ? `http://localhost:3000/uploads/${employee.profile_picture}` : null
  );


  return (
    <div>
      <h1>Edit Employee</h1>
      <Form method="post" encType="multipart/form-data">
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Profile" width="100" />
          </div>
        )}

          <div>
          <label htmlFor="profile_picture">Profile Picture</label>
          <input type="file" name="profile_picture" id="profile_picture" accept="image/*" />
        </div>
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input defaultValue={employee.full_name} type="text" name="full_name" id="full_name" required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input defaultValue={employee.email} type="email" name="email" id="email" required />
        </div>

        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input defaultValue={employee.phone_number} type="tel" name="phone_number" id="phone_number" required />
        </div>

        <div>
          <label htmlFor="date_of_birth">Date Of Birth</label>
          <input defaultValue={employee.date_of_birth} type="date" name="date_of_birth" id="date_of_birth" required />
        </div>

        <div>
          <label htmlFor="job_title">Job Title</label>
          <input defaultValue={employee.job_title} type="text" name="job_title" id="job_title" required />
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <input defaultValue={employee.department} type="text" name="department" id="department" required />
        </div>

        <div>
          <label htmlFor="salary">Salary</label>
          <input defaultValue={employee.salary} type="number" name="salary" id="salary" required step="0.01" min="0" />
        </div>

        <div>
          <label htmlFor="start_date">Start Date</label>
          <input defaultValue={employee.start_date} type="date" name="start_date" id="start_date" required />
        </div>

        <div>
          <label htmlFor="end_date">End Date</label>
          <input defaultValue={employee.end_date} type="date" name="end_date" id="end_date" />
        </div>

        <div>
          <button type="submit">Save Changes</button>
        </div>
      </Form>
    </div>
  );
}

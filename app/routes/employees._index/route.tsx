import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");

  const baseUrl = "http://localhost:3000/uploads/";
  const employeesWithFullPath = employees.map((employee: any) => ({
    ...employee,
    profile_picture_url: employee.profile_picture ? `${baseUrl}${employee.profile_picture}` : null
  }));

  return { employees: employeesWithFullPath };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();
  return (
    <div>
      <div>
        {employees.map((employee: any) => (
          <div key={employee.id}>
            <ul>
              <li>Employee #{employee.id}</li>
              <ul>
                <li>Full Name: <a href={`/employees/${employee.id}`}>{employee.full_name}</a></li>
              </ul>
              <ul>
                <li>Email: {employee.email}</li>
              </ul>
              <ul>
                <li>Phone Number: {employee.phone_number}</li>
              </ul>
              <ul>
                <li>Date Of Birth: {employee.date_of_birth}</li>
              </ul>
              <ul>
                <li>Job Title: {employee.job_title}</li>
              </ul>
              {employee.profile_picture_url && (
                <ul>
                  <li>
                    <img src={employee.profile_picture_url} alt={`${employee.full_name}'s profile`} width="100" />
                  </li>
                </ul>
              )}
              <ul>
                <li>
                  <a href={`/employees/${employee.id}/edit`}>Edit</a>
                </li>
              </ul>
            </ul>
          </div>
        ))}
      </div>
      <hr />
      <ul>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  );
}

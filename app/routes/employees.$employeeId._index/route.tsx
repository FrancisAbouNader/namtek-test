import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { employeeId?: string } }) {
  try {
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
  } catch (error) {
    console.error("Loader Error:", error);
    throw new Response("An unexpected error occurred.", { status: 500 });
  }
}

export default function EmployeePage() {
  const { employee } = useLoaderData();

  return (
    <div>
      <h1>Employee Details</h1>
      <ul>
        <li>Employee #{employee?.id}</li>
        <li>Full Name: <a href={`/employees/${employee?.id}`}>{employee?.full_name}</a></li>
        <li>Email: {employee?.email}</li>
        <li>Phone Number: {employee?.phone_number}</li>
        <li>Date Of Birth: {employee?.date_of_birth}</li>
        <li>Job Title: {employee?.job_title}</li>
      </ul>
      <hr />
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/employees/new">New Employee</a></li>
        <li><a href="/timesheets/">Timesheets</a></li>
      </ul>
    </div>
  );
}
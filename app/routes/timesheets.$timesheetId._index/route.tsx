import { Form, useLoaderData, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { timesheetId?: string } }) {
  const db = await getDB();
  const timesheetId = params.timesheetId;
  const employees = await db.all('SELECT id, full_name FROM employees');

  if (!timesheetId) {
    throw new Response("Timesheet ID is required", { status: 400 });
  }

  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", timesheetId);

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  return { employees, timesheet };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id"); 
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  const timesheetId = params.timesheetId;

  const db = await getDB();

  // Update the timesheet record
  await db.run(
    'UPDATE timesheets SET employee_id = ?, start_time = ?, end_time = ? WHERE id = ?',
    [employee_id, start_time, end_time, timesheetId]
  );

  return redirect("/timesheets"); 
}

export default function TimesheetPage() {
  const { employees, timesheet } = useLoaderData();

  return (
    <div>
      <h1>Edit Timesheet</h1>
      <Form method="post">
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input 
            defaultValue={timesheet.start_time} 
            type="datetime-local" 
            name="start_time" 
            id="start_time" 
            required 
          />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input 
            defaultValue={timesheet.end_time} 
            type="datetime-local" 
            name="end_time" 
            id="end_time" 
            required 
          />
        </div>
        <div>
          <label htmlFor="employee_id">Employee</label>
          <select defaultValue={timesheet.employee_id} name="employee_id" id="employee_id" required>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Update Timesheet</button>
      </Form>
      <hr />
      <ul>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees/">Employees</a></li>
      </ul>
    </div>
  );
}

import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import CalendarComponent from "~/components/CalendarComponent";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.id AS id, timesheets.start_time AS start, timesheets.end_time AS end, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [calendarView,setCalendarView] = useState(false);

  return (
    <div>
      <div>
        <button onClick={()=>setCalendarView(false)}>Table View</button>
        <button onClick={()=>setCalendarView(true)}>Calendar View</button>
      </div>
      {/* Replace `true` by a variable that is changed when the view buttons are clicked */}
      {!calendarView ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: any) => (
            <div key={timesheet.id}>
              <ul>
                <li>Timesheet #{timesheet.id}</li>
                <ul>
                  <li>Employee: {timesheet.full_name} (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start}</li>
                  <li>End Time: {timesheet.end}</li>
                  <li>
                  <a href={`/timesheets/${timesheet.id}`}>Edit</a>
                </li>
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
        <CalendarComponent  events={timesheetsAndEmployees} />
        </div>
      )}
      <hr />
      <ul>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}

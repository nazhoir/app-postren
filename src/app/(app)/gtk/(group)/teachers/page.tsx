import React from "react";

export default function Page() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Teacher Section</h3>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Mathematics Department</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-600">
            <li>John Doe - Senior Math Teacher</li>
            <li>Jane Smith - Algebra Specialist</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Science Department</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-600">
            <li>Robert Johnson - Physics Teacher</li>
            <li>Mary Williams - Biology Teacher</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

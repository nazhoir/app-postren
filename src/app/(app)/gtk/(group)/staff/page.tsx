// components/StaffContent.jsx
export default function StaffContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Staff Section</h3>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Administrative Staff</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-600">
            <li>Sarah Connor - School Secretary</li>
            <li>Mike Ross - Administrative Assistant</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Support Staff</h4>
          <ul className="list-inside list-disc space-y-1 text-gray-600">
            <li>David Palmer - IT Support</li>
            <li>Linda Martinez - Library Assistant</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

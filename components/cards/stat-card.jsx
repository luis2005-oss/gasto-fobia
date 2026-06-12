export default function StatCard({ title, value, color }) {
  return (
    <div
      className="
card
p-6
"
    >
      <p
        className="
text-gray-400
mb-2
"
      >
        {title}
      </p>

      <h2
        className={`
text-3xl
font-bold
${color}
`}
      >
        {value}
      </h2>
    </div>
  );
}

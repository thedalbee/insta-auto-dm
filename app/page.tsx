export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          insta-auto-dm
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Automate Instagram DMs based on comment keywords
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Dashboard
          </a>
          <a
            href="/landing"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}

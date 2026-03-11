"use client";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-lg font-bold text-blue-400">insta-auto-dm</p>
            <p className="text-sm text-gray-400 mt-1">Automate Instagram DMs with keywords</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="/landing" className="hover:text-gray-200 transition-colors">Features</a>
            <a href="https://github.com" className="hover:text-gray-200 transition-colors">GitHub</a>
            <a href="mailto:contact@example.com" className="hover:text-gray-200 transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-8 pt-8 border-t border-gray-800">
          © 2026 insta-auto-dm. Open source, MIT license.
        </p>
      </div>
    </footer>
  );
}

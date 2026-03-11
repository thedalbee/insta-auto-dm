import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Automate Instagram DMs
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Reply to comments automatically. Set keywords, get instant DMs.
              Open-source. Self-hosted. Free.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <a href="/dashboard">Get Started</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-800"
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">📝 Keyword Triggers</h3>
                <p className="text-gray-600">
                  Set any keyword and the message to send when someone comments
                  with it.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">⚡ Instant Replies</h3>
                <p className="text-gray-600">
                  Automatically send DMs within seconds of receiving comments.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">📊 Activity Logs</h3>
                <p className="text-gray-600">
                  Track every DM sent. See what worked and what didn't.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">🔒 Open Source</h3>
                <p className="text-gray-600">
                  Full source code on GitHub. Deploy anywhere. No vendor lock-in.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">🏠 Self-Hosted</h3>
                <p className="text-gray-600">
                  Run on your own server. Use Vercel, Docker, or any Node.js host.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">💰 Free Forever</h3>
                <p className="text-gray-600">
                  No subscription fees. Just your server costs (~$5-10/month).
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-2">
                <h3 className="text-2xl font-bold mb-4">Self-Hosted</h3>
                <div className="text-4xl font-bold mb-4">
                  $0<span className="text-lg">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li>✓ Unlimited triggers</li>
                  <li>✓ Full source code</li>
                  <li>✓ Your own server</li>
                  <li>✓ Community support</li>
                </ul>
                <Button asChild className="w-full">
                  <a href="#setup">Get Started</a>
                </Button>
              </Card>
              <Card className="p-8 border-2 border-blue-600 bg-blue-50">
                <h3 className="text-2xl font-bold mb-4">Managed Hosting</h3>
                <div className="text-4xl font-bold mb-4">
                  $5-10<span className="text-lg">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li>✓ All self-hosted features</li>
                  <li>✓ We manage the server</li>
                  <li>✓ Automatic updates</li>
                  <li>✓ Email support</li>
                </ul>
                <Button asChild className="w-full bg-blue-600">
                  <a href="mailto:contact@example.com">Get in Touch</a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Setup */}
        <section id="setup" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Quick Start</h2>

            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">1. Clone the repo</h3>
                <code className="block bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  git clone https://github.com/yourusername/insta-auto-dm.git
                </code>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  2. Set up environment variables
                </h3>
                <code className="block bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  cp .env.example .env.local
                </code>
                <p className="text-gray-600 mt-3">
                  Fill in your Meta App credentials and database URL.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  3. Install and run
                </h3>
                <code className="block bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  npm install && npm run dev
                </code>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  4. Set up Meta webhook
                </h3>
                <p className="text-gray-600">
                  Point your Meta app's webhook URL to:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    https://yourdomain.com/api/webhooks/instagram
                  </code>
                </p>
              </Card>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                📖{" "}
                <a
                  href="#readme"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  See full documentation
                </a>{" "}
                for detailed setup instructions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 text-white py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to automate your DMs?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Start free. Self-host or use our managed service.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

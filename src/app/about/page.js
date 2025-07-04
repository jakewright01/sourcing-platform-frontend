export default function AboutPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-6">
            How SourceMe Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI-powered platform makes finding anything simple and efficient
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">1. Describe Your Need</h3>
            <p className="text-gray-600 dark:text-gray-300">Tell us exactly what you're looking for with as much detail as possible</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 dark:bg-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">2. AI Matching</h3>
            <p className="text-gray-600 dark:text-gray-300">Our AI analyses your request and finds the best matches from our network</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 dark:bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">3. Get Results</h3>
            <p className="text-gray-600 dark:text-gray-300">Review curated matches and connect with sellers directly</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6 text-center">
            Why Choose SourceMe?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">AI-Powered Matching</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Advanced algorithms find exactly what you need</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Multiple Platforms</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Search across eBay, Depop, Vinted and more</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Real-Time Results</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Get instant notifications when matches are found</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Secure & Trusted</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Safe transactions with verified sellers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
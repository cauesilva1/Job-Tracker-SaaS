export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Environment Variables</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Environment Variables:</h2>
          
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
              <span className="ml-2 text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
              <span className="ml-2 text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
              </span>
            </div>
            
            <div>
              <strong>NEXT_PUBLIC_SITE_URL:</strong> 
              <span className="ml-2 text-gray-600">
                {process.env.NEXT_PUBLIC_SITE_URL || '❌ Not set'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Expected Values:</h3>
            <ul className="text-sm space-y-1">
              <li>• NEXT_PUBLIC_SITE_URL should be: https://job-tracker-saas-five.vercel.app</li>
              <li>• NEXT_PUBLIC_SUPABASE_URL should be your Supabase project URL</li>
              <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY should be your Supabase anon key</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-100 rounded">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ul className="text-sm space-y-1">
              <li>1. Check Vercel environment variables</li>
              <li>2. Verify Supabase OAuth settings</li>
              <li>3. Check Google Cloud Console settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
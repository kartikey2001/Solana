// Simple test script to verify backend is working
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Testing Meteora DBC Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test dashboard stats
    console.log('\n2. Testing dashboard stats...');
    const statsResponse = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
    console.log('✅ Dashboard stats:', statsResponse.data);

    // Test dashboard tokens
    console.log('\n3. Testing dashboard tokens...');
    const tokensResponse = await axios.get(`${API_BASE_URL}/api/dashboard/tokens`);
    console.log('✅ Dashboard tokens:', tokensResponse.data);

    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Start the frontend: cd frontend && npm run dev');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Connect your Phantom wallet');
    console.log('4. Create your first token!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify all dependencies are installed');
  }
}

testBackend();

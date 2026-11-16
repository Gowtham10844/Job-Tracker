// tests/verifyApi.js
// Automated verification script for JobTrack API endpoints
import http from 'http';
import app from '../server.js';

let server;
const PORT = 5099; // Test port to avoid collisions

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Length'] = Buffer.byteLength(dataString);

    const req = http.request(
      {
        host: '127.0.0.1',
        port: PORT,
        method,
        path,
        headers,
      },
      res => {
        let responseBody = '';
        res.on('data', chunk => (responseBody += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseBody });
          }
        });
      }
    );

    req.on('error', err => reject(err));
    if (body) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting JobTrack API Verification Suite...\n');

  server = app.listen(PORT, async () => {
    try {
      // 1. Root Endpoint
      console.log('1️⃣ Testing GET / (Root Health Check)...');
      const rootRes = await request('GET', '/');
      console.log(`   Status: ${rootRes.status}, Name: ${rootRes.data.name}`);
      if (rootRes.status !== 200) throw new Error('Root health check failed');

      // 2. Authentication: Login with pre-seeded demo user
      console.log('\n2️⃣ Testing POST /api/auth/login (Demo User)...');
      const loginRes = await request('POST', '/api/auth/login', {
        email: 'sayimpugowtham@gmail.com',
        password: 'password123',
      });
      console.log(`   Status: ${loginRes.status}, User: ${loginRes.data.user?.name}`);
      if (loginRes.status !== 200 || !loginRes.data.token) {
        throw new Error('Demo login failed: ' + JSON.stringify(loginRes.data));
      }
      const token = loginRes.data.token;

      // 3. User Profile: GET /api/auth/me
      console.log('\n3️⃣ Testing GET /api/auth/me (Protected Profile)...');
      const meRes = await request('GET', '/api/auth/me', null, token);
      console.log(`   Status: ${meRes.status}, Email: ${meRes.data.user?.email}`);
      if (meRes.status !== 200) throw new Error('Get profile failed');

      // 4. Dashboard Stats: GET /api/dashboard/stats
      console.log('\n4️⃣ Testing GET /api/dashboard/stats...');
      const statsRes = await request('GET', '/api/dashboard/stats', null, token);
      console.log(
        `   Status: ${statsRes.status}, Total Apps: ${statsRes.data.stats?.total}, Offers: ${statsRes.data.stats?.offers}`
      );
      if (statsRes.status !== 200) throw new Error('Dashboard stats failed');

      // 5. Applications: GET /api/applications
      console.log('\n5️⃣ Testing GET /api/applications...');
      const appsRes = await request('GET', '/api/applications', null, token);
      console.log(`   Status: ${appsRes.status}, Count: ${appsRes.data.count}`);
      if (appsRes.status !== 200 || !Array.isArray(appsRes.data.data)) {
        throw new Error('Get applications failed');
      }

      // 6. Applications: POST /api/applications (Create new)
      console.log('\n6️⃣ Testing POST /api/applications (Create)...');
      const createRes = await request(
        'POST',
        '/api/applications',
        {
          companyName: 'NVIDIA',
          jobRole: 'AI/ML Systems Engineer Intern',
          jobType: 'Internship',
          location: 'Pune, India',
          workMode: 'Hybrid',
          status: 'Applied',
          salary: '₹95,000 / month',
          notes: 'Applied with custom resume tailored for CUDA & deep learning systems.',
        },
        token
      );
      console.log(`   Status: ${createRes.status}, ID: ${createRes.data.data?._id}`);
      if (createRes.status !== 201) throw new Error('Create application failed');
      const newAppId = createRes.data.data._id;

      // 7. Applications: Search & Filter
      console.log('\n7️⃣ Testing GET /api/applications?search=NVIDIA...');
      const searchRes = await request(
        'GET',
        '/api/applications?search=NVIDIA',
        null,
        token
      );
      console.log(`   Status: ${searchRes.status}, Found: ${searchRes.data.count} items`);
      if (searchRes.status !== 200 || searchRes.data.count < 1) {
        throw new Error('Search failed');
      }

      // 8. Applications: PUT /api/applications/:id (Update stage)
      console.log(`\n8️⃣ Testing PUT /api/applications/${newAppId} (Stage Update)...`);
      const updateRes = await request(
        'PUT',
        `/api/applications/${newAppId}`,
        {
          status: 'Interview',
          interviewDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
        },
        token
      );
      console.log(
        `   Status: ${updateRes.status}, New Status: ${updateRes.data.data?.status}`
      );
      if (updateRes.status !== 200 || updateRes.data.data?.status !== 'Interview') {
        throw new Error('Update application failed');
      }

      // 9. Interviews: GET /api/interviews
      console.log('\n9️⃣ Testing GET /api/interviews...');
      const interviewsRes = await request('GET', '/api/interviews', null, token);
      console.log(
        `   Status: ${interviewsRes.status}, Total Interviews: ${interviewsRes.data.totalInterviews}, Upcoming: ${interviewsRes.data.upcoming?.length}`
      );
      if (interviewsRes.status !== 200) throw new Error('Get interviews failed');

      // 10. Applications: DELETE /api/applications/:id
      console.log(`\n🔟 Testing DELETE /api/applications/${newAppId}...`);
      const deleteRes = await request(
        'DELETE',
        `/api/applications/${newAppId}`,
        null,
        token
      );
      console.log(`   Status: ${deleteRes.status}, Message: ${deleteRes.data.message}`);
      if (deleteRes.status !== 200) throw new Error('Delete application failed');

      console.log('\n🎉 ALL 10 API TEST SUITES PASSED FLAWLESSLY!\n');
      process.exit(0);
    } catch (err) {
      console.error('\n❌ Test Suite Failed:', err.message);
      process.exit(1);
    } finally {
      if (server) server.close();
    }
  });
}

runTests();

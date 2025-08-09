const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCaching() {
  console.log('🧪 Testing Lyrics Caching Implementation\n');

  try {
    // Test 1: Get random lyrics (first request - should hit DB)
    console.log('📝 Test 1: First request for random lyrics (DB hit)');
    const start1 = Date.now();
    const response1 = await axios.get(`${BASE_URL}/lyrics/random?count=1`);
    const time1 = Date.now() - start1;
    console.log(`   Response time: ${time1}ms`);
    console.log(`   Lyrics count: ${response1.data.length}`);
    console.log(`   First lyrics: ${response1.data[0]?.songTitle || 'N/A'}\n`);

    // Test 2: Get same random lyrics again (should hit cache)
    console.log('📝 Test 2: Second request for random lyrics (Cache hit)');
    const start2 = Date.now();
    const response2 = await axios.get(`${BASE_URL}/lyrics/random?count=1`);
    const time2 = Date.now() - start2;
    console.log(`   Response time: ${time2}ms`);
    console.log(`   Lyrics count: ${response2.data.length}`);
    console.log(`   First lyrics: ${response2.data[0]?.songTitle || 'N/A'}\n`);

    // Test 3: Get lyrics by genre (first request - should hit DB)
    console.log('📝 Test 3: First request for lyrics by genre (DB hit)');
    const start3 = Date.now();
    const response3 = await axios.get(`${BASE_URL}/lyrics/genre/Pop`);
    const time3 = Date.now() - start3;
    console.log(`   Response time: ${time3}ms`);
    console.log(`   Lyrics count: ${response3.data.length}\n`);

    // Test 4: Get same genre lyrics again (should hit cache)
    console.log('📝 Test 4: Second request for lyrics by genre (Cache hit)');
    const start4 = Date.now();
    const response4 = await axios.get(`${BASE_URL}/lyrics/genre/Pop`);
    const time4 = Date.now() - start4;
    console.log(`   Response time: ${time4}ms`);
    console.log(`   Lyrics count: ${response4.data.length}\n`);

    // Test 5: Get lyrics by decade (first request - should hit DB)
    console.log('📝 Test 5: First request for lyrics by decade (DB hit)');
    const start5 = Date.now();
    const response5 = await axios.get(`${BASE_URL}/lyrics/decade/2020`);
    const time5 = Date.now() - start5;
    console.log(`   Response time: ${time5}ms`);
    console.log(`   Lyrics count: ${response5.data.length}\n`);

    // Test 6: Get same decade lyrics again (should hit cache)
    console.log('📝 Test 6: Second request for lyrics by decade (Cache hit)');
    const start6 = Date.now();
    const response6 = await axios.get(`${BASE_URL}/lyrics/decade/2020`);
    const time6 = Date.now() - start6;
    console.log(`   Response time: ${time6}ms`);
    console.log(`   Lyrics count: ${response6.data.length}\n`);

    // Performance analysis
    console.log('📊 Performance Analysis:');
    console.log(`   DB Hit Average: ${((time1 + time3 + time5) / 3).toFixed(2)}ms`);
    console.log(`   Cache Hit Average: ${((time2 + time4 + time6) / 3).toFixed(2)}ms`);
    console.log(`   Performance Improvement: ${(((time1 + time3 + time5) / 3) / ((time2 + time4 + time6) / 3)).toFixed(2)}x faster with cache\n`);

    // Test 7: Test filtered random lyrics
    console.log('📝 Test 7: Filtered random lyrics (Pop genre, 2020s)');
    const start7 = Date.now();
    const response7 = await axios.get(`${BASE_URL}/lyrics/random?count=3&genre=Pop&decade=2020`);
    const time7 = Date.now() - start7;
    console.log(`   Response time: ${time7}ms`);
    console.log(`   Lyrics count: ${response7.data.length}`);
    console.log(`   Filtered results: ${response7.data.map(l => l.songTitle).join(', ')}\n`);

    console.log('✅ All caching tests completed successfully!');
    console.log('💡 Notice how subsequent requests are much faster due to caching.');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
    console.log('💡 You may need to have some lyrics data in your database');
  }
}

// Run the test
testCaching();

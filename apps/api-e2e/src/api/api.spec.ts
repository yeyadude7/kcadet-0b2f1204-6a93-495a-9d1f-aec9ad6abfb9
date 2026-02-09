import axios from 'axios';

describe('Auth (e2e)', () => {
  it('POST /api/auth/login returns accessToken', async () => {
    const res = await axios.post('/api/auth/login', {
      email: 'owner@acme.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201); // change to 200 if needed
    expect(res.data.accessToken).toBeDefined();
  });
});

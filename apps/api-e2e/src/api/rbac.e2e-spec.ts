import axios from 'axios';

async function login(email: string, password: string) {
  const res = await axios.post('/api/auth/login', { email, password });
  return res.data.accessToken as string;
}

describe('RBAC + Org Scope (e2e)', () => {
  it('Owner can list tasks', async () => {
    const token = await login('owner@acme.com', 'Password123!');
    const res = await axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('Viewer cannot create tasks (403)', async () => {
    const token = await login('viewer@acme.com', 'Password123!');
    await expect(
      axios.post(
        '/api/tasks',
        { title: 'Nope', category: 'Work', status: 'Todo' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).rejects.toMatchObject({ response: { status: 403 } });
  });

  it('Owner can create tasks', async () => {
    const token = await login('owner@acme.com', 'Password123!');
    const res = await axios.post(
      '/api/tasks',
      { title: 'Created by Jest', category: 'Work', status: 'Todo' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect([200, 201]).toContain(res.status);
    expect(res.data.id).toBeDefined();
  });

  it('Viewer cannot read audit-log (403), Owner can (200)', async () => {
    const viewer = await login('viewer@acme.com', 'Password123!');
    await expect(
      axios.get('/api/audit-log', { headers: { Authorization: `Bearer ${viewer}` } })
    ).rejects.toMatchObject({ response: { status: 403 } });

    const owner = await login('owner@acme.com', 'Password123!');
    const res = await axios.get('/api/audit-log', {
      headers: { Authorization: `Bearer ${owner}` },
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
});

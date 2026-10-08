import http from 'http';
import app from '../src/app.js';

const PORT = 4001; // Usar puerto 4001 para la prueba

const server = app.listen(PORT, async () => {
  console.log('🧪 Iniciando batería de pruebas de autenticación...');

  let testPassed = 0;
  let testTotal = 0;

  async function assert(desc, condition) {
    testTotal++;
    if (condition) {
      testPassed++;
      console.log(`   ✅ PASS: ${desc}`);
    } else {
      console.error(`   ❌ FAIL: ${desc}`);
    }
  }

  try {
    // 1. Probar Login con contraseña errónea
    console.log('\n1. Test: Login con credenciales incorrectas');
    const resBad = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trilloeventos.com', password: 'clave_incorrecta' }),
    });
    const dataBad = await resBad.json();
    await assert('Rechaza login con código HTTP 401', resBad.status === 401);
    await assert('Código de error es INVALID_CREDENTIALS', dataBad.error?.code === 'INVALID_CREDENTIALS');

    // 2. Probar Login con credenciales correctas
    console.log('\n2. Test: Login exitoso con bcrypt y JWT');
    const resGood = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trilloeventos.com', password: 'Trillo2026!Admin' }),
    });
    const dataGood = await resGood.json();
    const setCookieHeader = resGood.headers.get('set-cookie');

    await assert('Responde con código HTTP 200', resGood.status === 200);
    await assert('Retorna usuario con rol admin', dataGood.user?.role === 'admin');
    await assert('Emite cookie trillo_admin_token', setCookieHeader && setCookieHeader.includes('trillo_admin_token'));
    await assert('Cookie tiene flag HttpOnly', setCookieHeader && setCookieHeader.includes('HttpOnly'));

    const token = dataGood.token;
    const cookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    // 3. Probar /api/auth/me sin autenticación
    console.log('\n3. Test: Acceso a /api/auth/me sin token');
    const resMeUnauth = await fetch(`http://localhost:${PORT}/api/auth/me`);
    const dataMeUnauth = await resMeUnauth.json();
    await assert('Rechaza acceso sin token con 401', resMeUnauth.status === 401);
    await assert('Código de error es AUTH_REQUIRED', dataMeUnauth.error?.code === 'AUTH_REQUIRED');

    // 4. Probar /api/auth/me con Cookie
    console.log('\n4. Test: Acceso a /api/auth/me con Cookie HttpOnly');
    const resMeCookie = await fetch(`http://localhost:${PORT}/api/auth/me`, {
      headers: { Cookie: cookie },
    });
    const dataMeCookie = await resMeCookie.json();
    await assert('Responde 200 OK con Cookie', resMeCookie.status === 200);
    await assert('Devuelve email correcto del admin', dataMeCookie.user?.email === 'admin@trilloeventos.com');

    // 5. Probar /api/auth/me con Bearer Token Header
    console.log('\n5. Test: Acceso a /api/auth/me con Authorization Bearer Header');
    const resMeBearer = await fetch(`http://localhost:${PORT}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataMeBearer = await resMeBearer.json();
    await assert('Responde 200 OK con Bearer Token', resMeBearer.status === 200);
    await assert('Devuelve id correcto del admin', dataMeBearer.user?.id === 'd4de870b-821f-46e9-8cd4-df42023f9cf4');

    // 6. Probar Logout
    console.log('\n6. Test: Logout');
    const resLogout = await fetch(`http://localhost:${PORT}/api/auth/logout`, {
      method: 'POST',
    });
    const logoutCookie = resLogout.headers.get('set-cookie');
    await assert('Responde 200 OK en logout', resLogout.status === 200);
    await assert('Limpia la cookie (Max-Age=0 o caducada)', logoutCookie && (logoutCookie.includes('Max-Age=0') || logoutCookie.includes('Expires=')));

    console.log(`\n🏁 RESULTADO FINAL: ${testPassed}/${testTotal} tests pasados.`);
  } catch (err) {
    console.error('Error durante el test:', err);
  } finally {
    server.close();
    process.exit(testPassed === testTotal ? 0 : 1);
  }
});

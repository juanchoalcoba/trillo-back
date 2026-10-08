import app from '../src/app.js';

const PORT = 4002;

const server = app.listen(PORT, async () => {
  console.log('🧪 Iniciando batería de pruebas para endpoints CRUD (Eventos, Aventuras y Tienda)...\n');

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
    // ----------------------------------------------------
    // 1. ENDPOINTS PÚBLICOS
    // ----------------------------------------------------
    console.log('--- 1. Pruebas Públicas de Lectura ---');

    // Events
    const resEvents = await fetch(`http://localhost:${PORT}/api/events`);
    const dataEvents = await resEvents.json();
    await assert('GET /api/events responde 200 OK', resEvents.status === 200);
    await assert('GET /api/events contiene al menos 3 eventos', dataEvents.count >= 3);

    // Event by slug
    const resEventSlug = await fetch(`http://localhost:${PORT}/api/events/desafio-rebollo`);
    const dataEventSlug = await resEventSlug.json();
    await assert('GET /api/events/desafio-rebollo responde 200 OK', resEventSlug.status === 200);
    await assert('Evento retornado tiene título Desafío Rebollo', dataEventSlug.event?.title === 'Desafío Rebollo');
    await assert('Evento tiene distancias en array', Array.isArray(dataEventSlug.event?.distances));

    // Adventures
    const resAdv = await fetch(`http://localhost:${PORT}/api/adventures`);
    const dataAdv = await resAdv.json();
    await assert('GET /api/adventures responde 200 OK', resAdv.status === 200);
    await assert('GET /api/adventures contiene al menos 9 expediciones', dataAdv.count >= 9);

    // Adventures filter by category
    const resAdvDurazno = await fetch(`http://localhost:${PORT}/api/adventures?category=durazno`);
    const dataAdvDurazno = await resAdvDurazno.json();
    await assert('GET /api/adventures?category=durazno filtra correctamente', dataAdvDurazno.count === 3);

    // Products
    const resProd = await fetch(`http://localhost:${PORT}/api/products`);
    const dataProd = await resProd.json();
    await assert('GET /api/products responde 200 OK', resProd.status === 200);
    await assert('GET /api/products contiene 5 prendas oficiales', dataProd.count >= 5);
    await assert('Prenda contiene precio numérico y talles', Number(dataProd.products[0]?.price) > 0);

    // ----------------------------------------------------
    // 2. SEGURIDAD: RUTAS ADMINISTRATIVAS RECHAZAN SIN AUTH
    // ----------------------------------------------------
    console.log('\n--- 2. Pruebas de Seguridad (Rechazo sin Auth) ---');

    const resUnauthPost = await fetch(`http://localhost:${PORT}/api/events/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hack', slug: 'hack', image_url: 'http://hack.com' }),
    });
    await assert('POST /api/events/admin sin token es rechazado con 401', resUnauthPost.status === 401);

    const resUnauthGet = await fetch(`http://localhost:${PORT}/api/events/admin/all`);
    await assert('GET /api/events/admin/all sin token es rechazado con 401', resUnauthGet.status === 401);

    // ----------------------------------------------------
    // 3. OPERACIONES CRUD ADMINISTRATIVAS (Con Auth)
    // ----------------------------------------------------
    console.log('\n--- 3. Pruebas CRUD Administrativas (Con Sesión Admin) ---');

    // Login para obtener token
    const resLogin = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trilloeventos.com', password: 'Trillo2026!Admin' }),
    });
    const dataLogin = await resLogin.json();
    const token = dataLogin.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Crear un evento temporal
    const testSlug = `evento-test-${Date.now()}`;
    const resCreate = await fetch(`http://localhost:${PORT}/api/events/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        slug: testSlug,
        title: 'Carrera Nocturna Test',
        subtitle: 'Prueba de integración CRUD',
        badge: 'Test Beta',
        season: 'Verano 2027',
        date_text: 'Diciembre 2027',
        location: 'Durazno Centro',
        elevation: '+100m',
        difficulty: 'Baja',
        terrain: 'Asfalto',
        image_url: 'https://res.cloudinary.com/pglfifpm/image/upload/v1791462580/trillo/events/eventosverti.jpg',
        short_description: 'Breve test',
        description: 'Descripción completa de prueba',
        distances: ['5K'],
        status: 'published',
        order_index: 99,
      }),
    });
    const dataCreate = await resCreate.json();
    await assert('POST /api/events/admin crea el evento con 201', resCreate.status === 201);
    const createdId = dataCreate.event?.id;
    await assert('El evento creado tiene un ID UUID válido', Boolean(createdId));

    // Modificar el evento
    const resUpdate = await fetch(`http://localhost:${PORT}/api/events/admin/${createdId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Carrera Nocturna Test EDITADA',
      }),
    });
    const dataUpdate = await resUpdate.json();
    await assert('PUT /api/events/admin/:id actualiza el título', dataUpdate.event?.title === 'Carrera Nocturna Test EDITADA');

    // Cambiar estado a borrador
    const resToggle = await fetch(`http://localhost:${PORT}/api/events/admin/${createdId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'draft' }),
    });
    const dataToggle = await resToggle.json();
    await assert('PATCH /api/events/admin/:id/status cambia estado a draft', dataToggle.event?.status === 'draft');

    // Eliminar el evento
    const resDelete = await fetch(`http://localhost:${PORT}/api/events/admin/${createdId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const dataDelete = await resDelete.json();
    await assert('DELETE /api/events/admin/:id elimina el evento con éxito', resDelete.status === 200 && dataDelete.success);

    console.log(`\n🏁 RESULTADO FINAL: ${testPassed}/${testTotal} tests pasados.`);
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    server.close();
    process.exit(testPassed === testTotal ? 0 : 1);
  }
});

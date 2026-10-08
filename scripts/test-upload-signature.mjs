import app from '../src/app.js';
import cloudinary from '../src/config/cloudinary.js';

const PORT = 4003;

const server = app.listen(PORT, async () => {
  console.log('🧪 Iniciando prueba de firma criptográfica y subida a Cloudinary...\n');

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
    // 1. Probar rechazo sin sesión
    console.log('1. Test: Seguridad (rechazo sin sesión)');
    const resUnauth = await fetch(`http://localhost:${PORT}/api/uploads/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'trillo/events' }),
    });
    await assert('POST /api/uploads/signature sin token es rechazado con 401', resUnauth.status === 401);

    // 2. Login de admin
    console.log('\n2. Test: Obtención de sesión admin');
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

    // 3. Probar validación de carpeta no permitida
    console.log('\n3. Test: Validación de carpeta permitida');
    const resBadFolder = await fetch(`http://localhost:${PORT}/api/uploads/signature`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ folder: 'carpeta-ajena/test' }),
    });
    const dataBadFolder = await resBadFolder.json();
    await assert('Rechaza carpetas fuera del espacio trillo/ con 400', resBadFolder.status === 400);
    await assert('Código de error es INVALID_FOLDER', dataBadFolder.error?.code === 'INVALID_FOLDER');

    // 4. Probar generación de firma válida
    console.log('\n4. Test: Generación de firma criptográfica SHA-1');
    const resSig = await fetch(`http://localhost:${PORT}/api/uploads/signature`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ folder: 'trillo/test' }),
    });
    const dataSig = await resSig.json();

    await assert('Responde con código HTTP 200', resSig.status === 200);
    await assert('Retorna apiKey correcta', dataSig.apiKey === '294358133435788');
    await assert('Retorna cloudName correcto', dataSig.cloudName === 'pglfifpm');
    await assert('Retorna firma SHA-1 no vacía', typeof dataSig.signature === 'string' && dataSig.signature.length > 20);
    await assert('Retorna timestamp numérico', typeof dataSig.timestamp === 'number');

    // 5. Probar subida real a la API de Cloudinary usando la firma
    console.log('\n5. Test: Verificación real de la firma contra la API de Cloudinary');
    // Pequeño píxel 1x1 GIF en base64
    const tinyBase64Gif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const formData = new FormData();
    formData.append('file', tinyBase64Gif);
    formData.append('api_key', dataSig.apiKey);
    formData.append('timestamp', String(dataSig.timestamp));
    formData.append('signature', dataSig.signature);
    formData.append('folder', dataSig.folder);

    const resCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${dataSig.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const dataCloudinary = await resCloudinary.json();

    await assert('Cloudinary acepta la firma y responde 200 OK', resCloudinary.status === 200);
    await assert('Cloudinary entrega URL segura', typeof dataCloudinary.secure_url === 'string');
    console.log(`   🔗 URL subida de prueba: ${dataCloudinary.secure_url}`);

    // 6. Limpieza del archivo de prueba en Cloudinary
    if (dataCloudinary.public_id) {
      await cloudinary.uploader.destroy(dataCloudinary.public_id);
      console.log('   🧹 Archivo temporal de prueba eliminado de Cloudinary.');
    }

    console.log(`\n🏁 RESULTADO FINAL: ${testPassed}/${testTotal} tests pasados.`);
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    server.close();
    process.exit(testPassed === testTotal ? 0 : 1);
  }
});

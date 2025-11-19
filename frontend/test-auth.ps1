#!/usr/bin/env pwsh
# Script de prueba rápida de autenticación
# Uso: .\test-auth.ps1

Write-Host "🔐 Prueba de Autenticación - Tabletop Mastering" -ForegroundColor Cyan
Write-Host ""

# Configuración
$API_URL = "http://localhost:3000/api"
$TEST_EMAIL = "test-$(Get-Random)@example.com"
$TEST_PASSWORD = "password123"
$TEST_NAME = "Usuario Test"

Write-Host "📝 Configuración:" -ForegroundColor Yellow
Write-Host "   API URL: $API_URL"
Write-Host "   Email: $TEST_EMAIL"
Write-Host "   Contraseña: $TEST_PASSWORD"
Write-Host ""

# Test 1: Registro
Write-Host "1️⃣  Probando REGISTRO..." -ForegroundColor Green
$registerBody = @{
    name = $TEST_NAME
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"

    Write-Host "   ✅ Registro exitoso" -ForegroundColor Green
    Write-Host "   📦 Respuesta:" -ForegroundColor Gray
    $registerResponse | ConvertTo-Json -Depth 3 | Write-Host

    $token = $registerResponse.data.token
    $userId = $registerResponse.data.user.id

} catch {
    Write-Host "   ❌ Error en registro:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "2️⃣  Probando LOGIN..." -ForegroundColor Green
$loginBody = @{
    email = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"

    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
    Write-Host "   📦 Respuesta:" -ForegroundColor Gray
    $loginResponse | ConvertTo-Json -Depth 3 | Write-Host

    $token = $loginResponse.data.token

} catch {
    Write-Host "   ❌ Error en login:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""

# Test 3: Obtener perfil (ruta protegida)
Write-Host "3️⃣  Probando OBTENER PERFIL (ruta protegida)..." -ForegroundColor Green

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $profileResponse = Invoke-RestMethod -Uri "$API_URL/auth/me" `
        -Method Get `
        -Headers $headers

    Write-Host "   ✅ Perfil obtenido exitosamente" -ForegroundColor Green
    Write-Host "   📦 Respuesta:" -ForegroundColor Gray
    $profileResponse | ConvertTo-Json -Depth 3 | Write-Host

} catch {
    Write-Host "   ❌ Error al obtener perfil:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""

# Test 4: Probar token inválido (debe fallar)
Write-Host "4️⃣  Probando TOKEN INVÁLIDO (debe fallar)..." -ForegroundColor Green

try {
    $invalidHeaders = @{
        "Authorization" = "Bearer token_invalido_12345"
        "Content-Type" = "application/json"
    }

    $invalidResponse = Invoke-RestMethod -Uri "$API_URL/auth/me" `
        -Method Get `
        -Headers $invalidHeaders

    Write-Host "   ❌ ERROR: El token inválido fue aceptado!" -ForegroundColor Red
    exit 1

} catch {
    Write-Host "   ✅ Token inválido rechazado correctamente (401)" -ForegroundColor Green
}

Write-Host ""

# Test 5: Probar login con credenciales incorrectas (debe fallar)
Write-Host "5️⃣  Probando CREDENCIALES INCORRECTAS (debe fallar)..." -ForegroundColor Green

$wrongLoginBody = @{
    email = $TEST_EMAIL
    password = "contraseña_incorrecta"
} | ConvertTo-Json

try {
    $wrongLoginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -Body $wrongLoginBody `
        -ContentType "application/json"

    Write-Host "   ❌ ERROR: Credenciales incorrectas fueron aceptadas!" -ForegroundColor Red
    exit 1

} catch {
    Write-Host "   ✅ Credenciales incorrectas rechazadas correctamente" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ ¡Todas las pruebas pasaron exitosamente!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor Yellow
Write-Host "   ✅ Registro de usuario"
Write-Host "   ✅ Login de usuario"
Write-Host "   ✅ Obtener perfil con token"
Write-Host "   ✅ Rechazo de token inválido"
Write-Host "   ✅ Rechazo de credenciales incorrectas"
Write-Host ""
Write-Host "🔑 Token generado:" -ForegroundColor Yellow
Write-Host "   $token" -ForegroundColor Gray
Write-Host ""
Write-Host "👤 Usuario creado:" -ForegroundColor Yellow
Write-Host "   Email: $TEST_EMAIL"
Write-Host "   ID: $userId"
Write-Host ""


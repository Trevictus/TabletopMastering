// Cambiar a la base de datos tabletop
db = db.getSiblingDB("tabletop");

// Crear usuario solo si no existe
try {
  db.createUser({
    user: "admin",
    pwd: "password123",
    roles: [
      { role: "dbOwner", db: "tabletop" }
    ]
  });
  print("✅ Usuario admin creado en base de datos tabletop");
} catch (e) {
  if (e.codeName === "DuplicateKey" || e.message.includes("already exists")) {
    print("⚠️  Usuario admin ya existe en tabletop");
  } else {
    throw e;
  }
}

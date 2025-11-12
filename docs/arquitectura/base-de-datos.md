# 🗄️ Base de Datos

## Visión General

Tabletop Mastering utiliza **MongoDB** como base de datos NoSQL con **Mongoose** como ODM (Object Data Modeling).

## Colecciones

El proyecto cuenta con 4 colecciones principales:

```
MongoDB - tabletop_mastering
├── users           # Usuarios del sistema
├── groups          # Grupos de jugadores
├── games           # Catálogo de juegos
└── matches         # Partidas (en desarrollo)
```

---

## 1. Users (Usuarios)

### Esquema

```javascript
{
  name: String (requerido, 2-100 caracteres),
  email: String (único, requerido, formato email),
  password: String (hasheado con bcrypt),
  description: String (opcional),
  quote: String (opcional, frase favorita),
  avatar: String (opcional, URL),
  groups: [ObjectId] (referencia a Group),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Índices

- `email` - Único
- `createdAt` - Descendente

### Validaciones

- Email debe ser único y válido
- Password mínimo 6 caracteres (antes de hashear)
- Name entre 2 y 100 caracteres

---

## 2. Groups (Grupos)

### Esquema

```javascript
{
  name: String (requerido, 2-100 caracteres),
  description: String (opcional),
  avatar: String (opcional, URL),
  inviteCode: String (único, 8 caracteres),
  admin: ObjectId (referencia a User),
  members: [{
    user: ObjectId (referencia a User),
    role: String (enum: 'admin', 'member'),
    joinedAt: Date
  }],
  settings: {
    isPrivate: Boolean (default: true),
    allowMembersInvite: Boolean (default: true)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Índices

- `inviteCode` - Único
- `admin` - Referencia
- `members.user` - Referencia

### Generación de Código de Invitación

```javascript
// Genera código alfanumérico de 8 caracteres
// Ejemplo: "AB12CD34"
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

---

## 3. Games (Juegos)

### Esquema

```javascript
{
  // Información básica
  name: String (requerido),
  description: String (opcional),
  image: String (URL),
  thumbnail: String (URL),
  
  // Detalles de juego
  minPlayers: Number (1-100),
  maxPlayers: Number (1-100),
  playingTime: Number (minutos),
  minPlayTime: Number (opcional),
  maxPlayTime: Number (opcional),
  
  // Clasificación
  categories: [String],
  mechanics: [String],
  
  // Dificultad
  difficulty: String (enum: 'facil', 'medio', 'dificil'),
  
  // Información de publicación
  yearPublished: Number,
  designer: [String],
  publisher: [String],
  
  // Rating
  rating: {
    average: Number (0-10),
    usersRated: Number,
    rank: Number
  },
  
  // Integración BGG
  source: String (enum: 'bgg', 'custom'),
  bggId: Number (único si existe),
  lastSyncedAt: Date,
  
  // Asociación
  groupId: ObjectId (referencia a Group, opcional),
  isGlobal: Boolean (default: false),
  
  // Personalización
  customNotes: String,
  
  // Metadata
  createdBy: ObjectId (referencia a User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Índices

- `bggId` - Único (sparse)
- `name` - Texto (para búsqueda)
- `groupId` - Referencia
- `source` - Categorización
- `categories` - Array

### Tipos de Juegos

**Juegos de BGG** (`source: 'bgg'`)
- Datos importados de BoardGameGeek
- Cache de 30 días
- Sincronización manual disponible
- Pueden ser globales o por grupo

**Juegos Personalizados** (`source: 'custom'`)
- Creados manualmente
- Siempre asociados a un grupo
- Edición completa

---

## 4. Matches (Partidas) 🚧 En Desarrollo

### Esquema Planificado

```javascript
{
  // Información básica
  title: String,
  game: ObjectId (referencia a Game),
  group: ObjectId (referencia a Group),
  
  // Fecha y hora
  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  duration: Number (minutos),
  
  // Participantes
  players: [{
    user: ObjectId (referencia a User),
    status: String (enum: 'confirmed', 'pending', 'declined'),
    position: Number,
    score: Number,
    isWinner: Boolean
  }],
  
  // Detalles
  location: String,
  notes: String,
  photos: [String] (URLs),
  
  // Estado
  status: String (enum: 'scheduled', 'in-progress', 'completed', 'cancelled'),
  
  // Metadata
  createdBy: ObjectId (referencia a User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## Relaciones entre Colecciones

```
User
├─> groups[] → Group
└─> createdGames[] → Game

Group
├─> admin → User
├─> members[].user → User
└─> games[] → Game

Game
├─> groupId → Group
├─> createdBy → User
└─> matches[] → Match

Match
├─> game → Game
├─> group → Group
├─> players[].user → User
└─> createdBy → User
```

## Diagrama de Relaciones

```
┌─────────┐         ┌─────────┐
│  User   │◄────────┤  Group  │
└────┬────┘         └────┬────┘
     │                   │
     │ creates           │ has
     │                   │
     ▼                   ▼
┌─────────┐         ┌─────────┐
│  Game   │◄────────┤ Match   │
└─────────┘  uses   └─────────┘
```

---

## Validaciones y Middleware

### Pre-save Hooks

**User Model:**
```javascript
// Hashear password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Group Model:**
```javascript
// Generar código de invitación único
groupSchema.pre('save', async function(next) {
  if (!this.inviteCode) {
    this.inviteCode = await generateUniqueInviteCode();
  }
  next();
});
```

### Métodos de Instancia

**User:**
```javascript
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Group:**
```javascript
groupSchema.methods.addMember = function(userId, role = 'member') {
  this.members.push({ user: userId, role, joinedAt: new Date() });
  return this.save();
};
```

---

## Configuración de Conexión

```javascript
// backend/config/database.js
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
```

---

## Queries Comunes

### Usuarios

```javascript
// Buscar usuario por email
const user = await User.findOne({ email: 'user@example.com' });

// Obtener usuarios de un grupo
const users = await User.find({ groups: groupId });
```

### Grupos

```javascript
// Buscar grupo por código de invitación
const group = await Group.findOne({ inviteCode: 'ABC12345' })
  .populate('admin', 'name email')
  .populate('members.user', 'name email avatar');

// Grupos de un usuario
const groups = await Group.find({ 
  'members.user': userId 
});
```

### Juegos

```javascript
// Juegos de un grupo
const games = await Game.find({ groupId })
  .sort({ name: 1 });

// Buscar juegos por texto
const games = await Game.find({
  $text: { $search: searchTerm }
});

// Juegos de BGG sin actualizar hace 30 días
const outdatedGames = await Game.find({
  source: 'bgg',
  lastSyncedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});
```

---

## Optimizaciones

### Índices de Rendimiento

```javascript
// Búsqueda de texto
gameSchema.index({ name: 'text', description: 'text' });

// Búsquedas frecuentes
gameSchema.index({ groupId: 1, source: 1 });
gameSchema.index({ bggId: 1 }, { unique: true, sparse: true });
```

### Poblado Selectivo

```javascript
// Poblar solo campos necesarios
const group = await Group.findById(groupId)
  .populate('admin', 'name email')
  .populate('members.user', 'name avatar')
  .lean(); // Convierte a objeto plano para mejor rendimiento
```

---

## Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Código de los Modelos](../../backend/models/)

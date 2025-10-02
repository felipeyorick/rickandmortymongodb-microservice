const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME) {
      throw new Error("❌ MONGO_URI o MONGO_DB_NAME no están definidos en .env");
    }
 
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
      useNewUrlParser: true,
    });
 
    console.log("✅ MongoDB conectado en:", process.env.MONGO_URI, "DB:", process.env.MONGO_DB_NAME);
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
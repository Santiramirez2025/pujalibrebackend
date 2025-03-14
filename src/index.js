require("dotenv").config();

console.log("📌 Variables de entorno cargadas:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("MERCADO_PAGO_KEY:", process.env.MERCADO_PAGO_KEY);

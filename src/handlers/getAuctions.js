module.exports.handler = async (event) => {
    console.log("📢 Obteniendo subastas...");
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Lista de subastas (simulación)" }),
    };
  };
  

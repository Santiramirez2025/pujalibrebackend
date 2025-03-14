module.exports.handler = async (event) => {
    console.log("📢 Creando una nueva subasta...");
    const data = JSON.parse(event.body);
  
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Subasta creada con éxito", data }),
    };
  };
  

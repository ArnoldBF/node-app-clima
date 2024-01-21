const axios = require("axios");

class Busquedas {
  historial = ["santacruz", "beni", "pando", "La paz"];

  constructor() {
    //leer DB si existee
  }
  get paramsMapBox() {
    return {
      limit: 5,
      language: "es",
      access_token:process.env.MAPBOX_KEY
    };
  }

  async ciudad(lugar = "") {
    //peticioon http

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });
      const resp = await instance.get();
      return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre:lugar.place_name,
        lng:lugar.center[0],
        lat:lugar.center[1],
      }));
     
    } catch (error) {
      return [];
    }
  }
  async climaLugar(lat,lon){
    try{
    
    }catch(error){
     console.log(error);
    }
  }
}

module.exports = Busquedas;

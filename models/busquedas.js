const fs = require("fs");

const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./DB/database.json";

  constructor() {
    this.leerDB();
  }
  get historialRespetandoMayusc() {
    //return this.historials;
    /*return this.historial.map((palabra) =>
      palabra.replace(/\b\w/g, (l) => l.toUpperCase())
    );**/
    return this.historial.map(palabra=>{
     let palabras=palabra.split(' ');
     palabras=palabras.map(p=>p[0].toUpperCase()+p.substring(1));
     return palabras.join(' ');
    })
  }
  get paramsMapBox() {
    return {
      limit: 10,
      language: "es",
      access_token: process.env.MAPBOX_KEY,
    };
  }
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
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
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }
  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });
      const resp = await instance.get();

      const { description } = resp.data.weather[0];
      const { temp, temp_min, temp_max } = resp.data.main;
      //  console.log(resp.data);

      return {
        descripcion: description,
        temperatura: temp,
        maxima: temp_max,
        minima: temp_min,
      };
    } catch (error) {
      console.log(error);
    }
  }
  agregarHistorial(lugar = "") {
    //
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial.unshift(lugar.toLocaleLowerCase());
    //Grabar en DB
    this.guardarDB();
  }
  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDB() {
    //debe de existir
    if (!fs.existsSync(this.dbPath)) return null;
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    //console.log(data);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;

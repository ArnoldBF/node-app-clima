require("dotenv").config();
const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        //Mostrar mensaje
        const lugar = await leerInput("Ciudad: ");
        //buscar los lugares
        const lugares = await busquedas.ciudad(lugar);

        //seleccionar el lugar
        const id = await listarLugares(lugares);
        if(id === '0') continue;
        const lugarSelec = lugares.find((l) => l.id === id);
       // console.log({ id });
        //console.log(lugarSelec);

        //Guardar en DB
        busquedas.agregarHistorial(lugarSelec.nombre);
        //clima
        const clima = await busquedas.climaLugar(
          lugarSelec.lat,
          lugarSelec.lng
        );
        //mostrar resultado
        console.clear();
        console.log("\nInformacion de la ciudad\n".green);
        console.log(`Ciudad: ${lugarSelec.nombre}`);
        console.log(`Lat: ${lugarSelec.lat}`);
        console.log(`Lng: ${lugarSelec.lng}`);
        console.log(`Temperatura: ${clima.temperatura}`);
        console.log(`Minima: ${clima.minima}`);
        console.log(`Maxima: ${clima.maxima}`);
        console.log(`Descripcion: ${clima.descripcion}`);

        break;
        case 2:
          
         busquedas.historialRespetandoMayusc.forEach((lugar,i)=>{
          const idx=`${i+1}.`.green;
          console.log(`${idx} ${lugar}`);
         })
        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();

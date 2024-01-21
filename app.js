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
        const lugarSelec=lugares.find(l=>l.id===id);
        console.log( {id });
        console.log(lugarSelec);

        //clima

        //mostrar resultado
        console.log("\nInformacion de la ciudad\n".green);
        console.log(`Ciudad: ${lugarSelec.nombre}`);
        console.log(`Lat: ${lugarSelec.lat}`);
        console.log(`Lng: ${lugarSelec.lng}`);
        console.log("Temperatura:");
        console.log("Minima:");
        console.log("Maxima:");

        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();

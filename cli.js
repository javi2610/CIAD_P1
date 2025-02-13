// cli.js

// Importar las librerías necesarias
const { Command } = require('commander'); // Para manejar comandos de línea de comandos
const { ethers } = require('ethers'); // Para interactuar con Ethereum y contratos inteligentes
const inquirer = require('inquirer'); // Para crear menús interactivos en la terminal
require('dotenv').config(); // Para cargar variables de entorno desde el archivo .env

// Crear una instancia de Command para manejar comandos
const program = new Command();

// Configurar el proveedor de Ethereum (en este caso, una red local de Hardhat)
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// Crear una billetera (wallet) usando la clave privada del archivo .env
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Obtener la dirección del contrato desde el archivo .env
const contractAddress = process.env.CONTRACT_ADDRESS;

// Definir el ABI (Interfaz Binaria de Aplicación) del contrato
const contractABI = [
  "function createRecord(string _data)", // Función para crear un registro
  "function updateRecord(uint256 _id, string _newData)", // Función para actualizar un registro
  "function getRecord(uint256 _id) view returns (uint256, string, address, uint256)", // Función para obtener un registro
  "function recordCount() view returns (uint256)", // Función para obtener el número total de registros
  "event RecordCreated(uint256 id, address owner, string data)", // Evento emitido al crear un registro
  "event RecordUpdated(uint256 id, string newData)" // Evento emitido al actualizar un registro
];

// Crear una instancia del contrato usando la dirección, el ABI y la billetera
const registry = new ethers.Contract(contractAddress, contractABI, wallet);

// Función para mostrar el menú principal
async function showMenu() {
  // Mostrar un menú interactivo usando inquirer
  const answers = await inquirer.prompt([
    {
      type: 'list', // Tipo de pregunta: lista de opciones
      name: 'action', // Nombre de la respuesta
      message: '¿Qué quieres hacer?', // Mensaje mostrado al usuario
      choices: [ // Opciones del menú
        'Crear un registro',
        'Actualizar un registro',
        'Ver un registro',
        'Escuchar eventos',
        'Salir'
      ],
    },
  ]);

  // Manejar la opción seleccionada por el usuario
  switch (answers.action) {
    case 'Crear un registro':
      await createRecord(); // Llamar a la función para crear un registro
      break;
    case 'Actualizar un registro':
      await updateRecord(); // Llamar a la función para actualizar un registro
      break;
    case 'Ver un registro':
      await viewRecord(); // Llamar a la función para ver un registro
      break;
    case 'Escuchar eventos':
      await listenEvents(); // Llamar a la función para escuchar eventos
      break;
    case 'Salir':
      console.log('¡Hasta luego!'); // Mensaje de despedida
      process.exit(0); // Salir de la aplicación
  }

  // Volver al menú después de realizar una acción
  showMenu();
}

// Función para crear un registro
async function createRecord() {
  // Preguntar al usuario los datos del registro
  const answers = await inquirer.prompt([
    {
      type: 'input', // Tipo de pregunta: entrada de texto
      name: 'data', // Nombre de la respuesta
      message: 'Introduce los datos del registro:', // Mensaje mostrado al usuario
    },
  ]);

  // Llamar a la función del contrato para crear un registro
  const tx = await registry.createRecord(answers.data);
  console.log(`Transacción enviada: ${tx.hash}`); // Mostrar el hash de la transacción
  await tx.wait(); // Esperar a que la transacción sea minada
  const recordId = await registry.recordCount(); // Obtener el ID del nuevo registro
  console.log(`Registro creado con ID: ${recordId.toString()}`); // Mostrar el ID del registro
}

// Función para actualizar un registro
async function updateRecord() {
  // Preguntar al usuario el ID del registro y los nuevos datos
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Introduce el ID del registro a actualizar:',
    },
    {
      type: 'input',
      name: 'newData',
      message: 'Introduce los nuevos datos:',
    },
  ]);

  // Llamar a la función del contrato para actualizar el registro
  const tx = await registry.updateRecord(answers.id, answers.newData);
  console.log(`Transacción enviada: ${tx.hash}`); // Mostrar el hash de la transacción
  await tx.wait(); // Esperar a que la transacción sea minada
  console.log(`Registro ${answers.id} actualizado`); // Confirmar la actualización
}

// Función para ver un registro
async function viewRecord() {
  // Preguntar al usuario el ID del registro a consultar
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Introduce el ID del registro a consultar:',
    },
  ]);

  try {
    // Llamar a la función del contrato para obtener el registro
    const record = await registry.getRecord(answers.id);
    // Mostrar los detalles del registro
    console.log(`
    ID: ${record[0]}
    Data: ${record[1]}
    Owner: ${record[2]}
    Timestamp: ${new Date(Number(record[3]) * 1000)}
    `);
  } catch (error) {
    console.error("Error al consultar el registro:", error); // Manejar errores
  }
}

// Función para escuchar eventos
async function listenEvents() {
  console.log('Escuchando eventos... (Presiona Ctrl+C para salir)');

  // Escuchar el evento RecordCreated
  registry.on('RecordCreated', (id, owner, data) => {
    console.log(`
    [NUEVO REGISTRO] ID: ${id}
    Owner: ${owner}
    Data: ${data}
    `);
  });

  // Escuchar el evento RecordUpdated
  registry.on('RecordUpdated', (id, newData) => {
    console.log(`
    [ACTUALIZACIÓN] ID: ${id}
    New Data: ${newData}
    `);
  });
}

// Iniciar la aplicación
console.log('Bienvenido al CLI de RecordRegistry');
showMenu(); // Mostrar el menú principal
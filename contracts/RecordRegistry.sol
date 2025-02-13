// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecordRegistry {
    // Definición de la estructura Record
    struct Record {
        uint256 id;
        string data;
        address owner;
        uint256 timestamp;
    }

    // Mapeo para almacenar los registros
    mapping(uint256 => Record) public records;

    // Contador de registros
    uint256 public recordCount;

    // Eventos
    event RecordCreated(uint256 id, address owner, string data);
    event RecordUpdated(uint256 id, string newData);

    // Función para crear un nuevo registro
    function createRecord(string memory _data) public {
        recordCount++; // Incrementa el contador de registros
        records[recordCount] = Record(
            recordCount, // ID del registro
            _data,       // Datos del registro
            msg.sender,  // Dirección del creador
            block.timestamp // Timestamp actual
        );
        emit RecordCreated(recordCount, msg.sender, _data); // Emite el evento
    }

    // Función para actualizar un registro existente
    function updateRecord(uint256 _id, string memory _newData) public {
        require(records[_id].owner == msg.sender, "Not the owner"); // Solo el propietario puede actualizar
        records[_id].data = _newData; // Actualiza los datos
        emit RecordUpdated(_id, _newData); // Emite el evento
    }

    // Función para consultar un registro
    function getRecord(uint256 _id) public view returns (uint256, string memory, address, uint256) {
        Record memory record = records[_id]; // Obtiene el registro
        return (record.id, record.data, record.owner, record.timestamp); // Devuelve los valores
    }
}
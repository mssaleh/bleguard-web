'use client'; 

import React, { useState, useEffect } from 'react';

const BLEDevice = () => {
  const [deviceValue, setDeviceValue] = useState(null);

  const targetDeviceMacAddress = 'DB:A0:C3:C0:27:2C';
  const targetPairingCode = '111111';
  const targetServiceUUID = '000019b0-0000-1000-8000-00805f9b34fb';
  const targetCharacteristicUUID = '000028ce-0000-1000-8000-00805f9b34fb';

  const connectToBLEDevice = async () => {
    try {
      console.log('Requesting BLE device...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ macAddress: targetDeviceMacAddress }],
        optionalServices: [targetServiceUUID],
      });
      console.log('Device connected:', device);

      console.log('Connecting to GATT server...');
      const server = await device.gatt.connect();
      console.log('GATT server connected:', server);

      console.log('Getting primary service...');
      const service = await server.getPrimaryService(targetServiceUUID);
      console.log('Primary service:', service);

      console.log('Getting characteristic...');
      const characteristic = await service.getCharacteristic(targetCharacteristicUUID);
      console.log('Characteristic:', characteristic);

      console.log('Starting notifications...');
      characteristic.addEventListener('characteristicvaluechanged', handleValueChanged);
      await characteristic.startNotifications();
      console.log('Notifications started');
    } catch (error) {
      console.error('Error connecting to BLE device:', error);
    }
  };

  const handleValueChanged = (event) => {
    const value = event.target.value.getHexString();  // Example: '(0x) F4-09'
    console.log('Raw value received:', value); 
    const processedValue = processValue(value); 
    console.log('Processed value:', processedValue); 
    setDeviceValue(processedValue);  
  };

  const processValue = (rawValue) => {
    const parts = rawValue.replace(/[^\w-]/g, '').split('-'); // Remove special chars
    const hexValue = parts.reverse().join('');  // 09F4
    return parseInt(hexValue, 16); // 2548
  };

  useEffect(() => {
    connectToBLEDevice();
  });

  return (
    <div>
      {/* Consider adding buttons to trigger the connectToBLEDevice function */}
      {deviceValue !== null ? (
        <p>Current Value: {deviceValue}</p>
      ) : (
        <p>Connecting to BLE Device...</p>
      )}
    </div>
  );
};

export default BLEDevice;

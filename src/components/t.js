// pages/index.js or a specific component

import { useEffect, useState } from 'react';

export default function Home() {
  const [value, setValue] = useState('');

  const readBLECharacteristic = async () => {
    try {
      // Step 1: Request the device
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000019b0-0000-1000-8000-00805f9b34fb'] }],
      });

      // Step 2: Connect to the device and get the service
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('000019b0-0000-1000-8000-00805f9b34fb');

      // Step 3: Get the characteristic and read the value
      const characteristic = await service.getCharacteristic('000028ce-0000-1000-8000-00805f9b34fb');
      const value = await characteristic.readValue();

      // Process the value - assumes value is DataView
      const hexValue = [...new Uint8Array(value.buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
      const processedValue = parseInt(hexValue.substring(2) + hexValue.substring(0, 2), 16);

      setValue(processedValue);
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  return (
    <div>
      <button onClick={readBLECharacteristic}>Read from BLE Device</button>
      {value && <p>Value: {value}</p>}
    </div>
  );
}

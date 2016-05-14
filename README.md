# bthue
Bluetooth to Philips Hue

# Installation
npm install

## Edit index.js:
set the host variable to THE IP OF YOUR HUE BRIDGE

set the username to a valid username that is registered with your bridge.

# Run
node index.js

This script needs a bluetooth connection with rfcomm.

# Raspberry Pi notes
For getting this running on a Raspberry Pi 3, I downloaded the latest Raspbian Jessie LITE and ran these commands:

sudo nano /etc/systemd/system/bluetooth.service
Edit/Add these lines:
```
  ExecStart=/usr/lib/bluetooth/bluetoothd -C
  ExecStartPost=/usr/bin/sdptool add SP
```

Save and Exit nano.
sudo reboot

show the BT address of the Pi:
hciconfig

Set up bluetooth
sudo bluetoothctl
  agent on
  default-agent
  scan on

Now scan for bluetooth devices with your smartphone. The bluetoothctl tool will list the phone and show its address xx:xx:xx:xx:xx:xx.

We want to pair this device:
  pair xx:xx:xx:xx:xx:xx
  
We need to agreed on the pin on the phone and on the Pi. Just hit enter on the Pi and see the message on the phone.
Now we want to trust the phone:
  trust xx:xx:xx:xx:xx:xx
  
Exit bluetoothctl:
  exit

Edit/Create rfcomm.service:
sudo nano /etc/systemd/system/rfcomm.service
```
  [Unit]
  Description=RFCOMM service
  After=bluetooth.service
  Requires=bluetooth.service
 
  [Service]
  ExecStart=/usr/local/bin/rfcomm watch hci0
 
  [Install]
  WantedBy=multi-user.target
```

Save and Exit nano.

At the shell:
  sudo systemctl enable rfcomm
  sudo systemctl start rfcomm

Now connect a Bluetooth Terminal app (I use Bluetooth Terminal by Qwerty on my Android).

For a simple test, you can:
  cat /dev/rfcomm0

Now you can run the bthue script.


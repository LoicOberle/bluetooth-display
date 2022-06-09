#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>

TFT_eSPI tft = TFT_eSPI();

String Name="BluetoothDisplay";
int screenWidth=240;
int screenHeight=135;

#include "BluetoothSerial.h"

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif
const int BUFFER_SIZE = 4056;
char buf[BUFFER_SIZE];
const int BITMAP_BUFFER_SIZE = 4050;
char bitmapBuf[BITMAP_BUFFER_SIZE];
BluetoothSerial SerialBT;
String messageString="";
void setup() {
 tft.init();
  tft.setRotation(1);
   tft.fillScreen(TFT_BLACK);
   tft.setTextSize(2);
   Serial.begin(115200);
  SerialBT.begin(Name); //Bluetooth device name
  tft.println("Device ready with name "+Name);
}

void loop() {

  if(SerialBT.available()){
      int rlen=SerialBT.readBytes(buf,BUFFER_SIZE);


uint16_t backgroundColor =    tft.color565((int)buf[0],(int)buf[1],(int)buf[2]);
uint16_t foregroundColor =  tft.color565((int)buf[3],(int)buf[4],(int)buf[5]);

for(int j=6;j<BUFFER_SIZE;j++){
  bitmapBuf[j-6]=buf[j];
  }
      tft.drawXBitmap(0, 0, (unsigned char*)bitmapBuf, screenWidth, screenHeight, foregroundColor,backgroundColor);

  }
 


}

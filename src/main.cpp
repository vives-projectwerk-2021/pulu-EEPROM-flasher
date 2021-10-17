#include "mbed.h"
#include "EEPROM_24AA64.h"
#include "keys.h"

MbedCRC<POLY_32BIT_ANSI, 32> mbedCRC;
EEPROM_24AA64 eeprom(D14, D15, 0b1010000<<1);
LoRaWANKeys keys;
DigitalOut led(LED1); //TODO: CHANGE LED PIN

struct LoRaWANCRC {
    uint32_t devEui;
    uint32_t appEui;
    uint32_t appKey;
};

int main(void)
{
    led = 0;
    LoRaWANCRC crc;
    
    mbedCRC.compute((void *)keys.devEui, 8, &crc.devEui);
    mbedCRC.compute((void *)keys.appEui, 8, &crc.appEui);
    mbedCRC.compute((void *)keys.appKey, 16, &crc.appKey);

    bool failure = false;

    char version[] = {0x01};
    if(!failure) failure |= eeprom.write(version, 1, 0);
    if(!failure) failure |= eeprom.write((char*)keys.devEui, 8, 1);
    if(!failure) failure |= eeprom.write((char*)&crc.devEui, 4, 9);
    if(!failure) failure |= eeprom.write((char*)keys.appEui, 8, 13);
    if(!failure) failure |= eeprom.write((char*)&crc.appEui, 4, 21);  
    if(!failure) failure |= eeprom.write((char*)keys.appKey, 16, 25);
    if(!failure) failure |= eeprom.write((char*)&crc.appKey, 4, 41);

    if(failure) {
        while(true) {
            led = 1;
            ThisThread::sleep_for(250ms);
            led = 0;
            ThisThread::sleep_for(250ms);
        }
    }
    else {
        led = 1;
        while(true) { }
    }

    return 0;
};
---
title:  "Internal Pullup Resistors on the Arduino for Digital and Analog Pins"
date:   2018-02-04 20:59:23 -0700
categories: 
 -arduino
classes: wide
excerpt: Set up an Arduino with internal pullup resistors via the AnalogRead() function.
header:
 og_image: /images/arduino_top_view.png
 teaser: /images/arduino_top_view.png
---


The following tutorial will show you how to set up your Arduino to use the internal pull-up resistors with the AnalogRead() function. 

Pull-up/pull-down resistors give the pins a reference. If this reference is not provided, then your readings will vary wildly, which is referred to as a floating pin. It is preferable to use external pull-up and pull-down resistors, but you can use the internal pull-up resistors which is simpler.
__Note: the Arduino does not have internal pull-down resistors. They will have to be external.__

* A pull-up resistor is connected to the high voltage level, giving for example 5V as reference, which means that the signal coming from a sensor will be inverted.
* A pull-down resistor is connected to the low voltage level, giving for example GROUND as reference, which means that the signal coming from a sensor will be non-inverted.

#### Digital Pins Internal Pull-Up Resistor 

If you want to use internal pull-up or pull-down resistors on digital pins, you can simply use the following commands:
~~~ cs
pinMode(2, INPUT_PULLUP);
~~~

#### Analog Pins Internal Pull-Up Resistor

The Arduino also has pull-up resistors, but it was somewhat difficult to find information about that so I made this quick tutorial.


__No pull-up resistors, Floating values:__

Consider the following code, used with an Arduino, which has nothing connected to analog pin A0: 

~~~ cs
void setup() {                
  Serial.begin(9600);  
}

void loop() {
  int k = analogRead(A0);   // turn the LED on (HIGH is the voltage level)
  delay(100);               // wait for a second
  Serial.println(k);
}
~~~

The output printed to the serial monitor, will vary at random, because no reference is provided: 


__Internal Pull-up resistor, Consistent values:__

Consider the following code, used with an Arduino, which has nothing connected to analog pin A0:

~~~ cs
void setup() {
  pinMode(A0, INPUT);
  digitalWrite(A0,HIGH);                
  Serial.begin(9600);  
}

void loop() {
  int k = analogRead(A0);   // turn the LED on (HIGH is the voltage level)
  delay(100);               // wait for a second
  Serial.println(k);
}
~~~

The output printed to the serial monitor reads roughly 1024 (with the values somewhat lower due to the influence of the resistor). 1024 corresponds to the 5V of the Arduino logic.


__Conclusion__

In this tutorial you were shown how to access the internal pullup resistors of the Arduino development boards for the digital and analog pins. 
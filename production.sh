#!/bin/bash

unset platform

read -p "Please input the platform to build(ios, android): " platform

export BUILD=production && ionic cordova build $platform --prod --release --device --buildConfi=build.json
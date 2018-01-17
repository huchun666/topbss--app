#!/bin/bash

unset platform

read -p "Please input the platform to build(ios, android): " platform

export BUILD=test && ionic cordova build $platform --prod --debug --device --buildConfig=build.json -- -- chcp-QA

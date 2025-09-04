#!/bin/bash
# Jenkins installation via WAR file on Ubuntu 20.04

# 1. Update system and install Java 11
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-11-jdk wget

# 2. Download Jenkins WAR file
wget https://get.jenkins.io/war-stable/latest/jenkins.war -O jenkins.war

# 3. Run Jenkins
nohup java -jar jenkins.war &> jenkins.log &
echo "Jenkins is starting in the background..."
echo "Access it at http://localhost:8080"
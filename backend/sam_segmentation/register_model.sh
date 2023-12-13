#!/bin/bash

resourcegroup="melanoma-tt"
workspace="cnn"

az login

az ml model create \
	-f ./model.yml \
	--resource-group $resourcegroup \
	--workspace-name $workspace

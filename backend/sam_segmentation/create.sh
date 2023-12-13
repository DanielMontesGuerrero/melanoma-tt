#!/bin/bash

endpoint_name="sam-segmentation"
resourcegroup="melanoma-tt"
workspace="cnn"

az login

az ml online-endpoint create \
	-f ./endpoint.yml \
	--name $endpoint_name \
	--resource-group $resourcegroup \
	--workspace-name $workspace

az ml online-deployment create \
	-f ./deployment.yml \
	--all-traffic \
	--endpoint-name $endpoint_name \
	--resource-group $resourcegroup \
	--workspace-name $workspace

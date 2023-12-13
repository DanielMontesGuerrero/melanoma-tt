#!/bin/bash

endpoint_name="sam-segmentation"
resourcegroup="melanoma-tt"
workspace="cnn"

az login

az ml online-endpoint update \
	-f ./endpoint.yml \
	--name $endpoint_name \
	--resource-group $resourcegroup \
	--workspace-name $workspace

az ml online-deployment update \
	-f ./deployment.yml \
	--endpoint-name $endpoint_name \
	--resource-group $resourcegroup \
	--workspace-name $workspace

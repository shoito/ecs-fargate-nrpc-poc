#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EcsFargateNrpcPocStack } from '../lib/ecs-fargate-nrpc-poc-stack';

const app = new cdk.App();
new EcsFargateNrpcPocStack(app, 'EcsFargateNrpcPocStack');

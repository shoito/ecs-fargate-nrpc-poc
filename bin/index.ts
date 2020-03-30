#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../lib/vpc";
import { AlbStack } from "../lib/alb";
import { EcsClusterStack } from "../lib/ecs-cluster";
import { EcsNrpcServiceStack } from "../lib/ecs-nrpc-service";
import { EcsXyzBffServiceStack } from "../lib/ecs-xyz-bff-service";
import { EcsAbcBffServiceStack } from "../lib/ecs-abc-bff-service";

const app = new cdk.App();
const vpcStack = new VpcStack(app, "PocVpcStack");
const albStack = new AlbStack(app, "PocAlbStack", { vpc: vpcStack.vpc });
const ecsClusterStack = new EcsClusterStack(app, "PocEcsClusterStack", {
  vpc: vpcStack.vpc
});
const ecsXyzBffServiceStack = new EcsXyzBffServiceStack(
  app,
  "PocEcsXyzBffServiceStack",
  {
    cluster: ecsClusterStack.cluster
  }
);
const ecsAbcBffServiceStack = new EcsAbcBffServiceStack(
  app,
  "PocEcsAbcBffServiceStack",
  {
    cluster: ecsClusterStack.cluster
  }
);
const ecsNrpcServiceStack = new EcsNrpcServiceStack(
  app,
  "PocEcsNrpcServiceStack",
  {
    cluster: ecsClusterStack.cluster,
    listener: albStack.listener
  }
);
ecsNrpcServiceStack.addDependency(ecsXyzBffServiceStack);
ecsNrpcServiceStack.addDependency(ecsAbcBffServiceStack);

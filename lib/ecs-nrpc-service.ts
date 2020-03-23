import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
  listener: elb.ApplicationListener;
  cloudMapNamespace: cloudmap.PrivateDnsNamespace;
}

export class EcsNrpcServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const PORT = 80;

    const taskDef = new ecs.FargateTaskDefinition(this, "poc-nrpc-task-def", {
      family: "poc-nrpc-task"
    });

    const logDriver = new ecs.AwsLogDriver({
      streamPrefix: "poc"
    });

    const container = taskDef.addContainer("poc-nrpc-container", {
      image: ecs.ContainerImage.fromAsset("./containers/nrpc"),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: logDriver
    });

    container.addPortMappings({
      containerPort: PORT,
      protocol: ecs.Protocol.TCP
    });

    const service = new ecs.FargateService(this, "poc-nrpc-service", {
      serviceName: "poc-nrpc-service",
      cluster: props.cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      cloudMapOptions: {
        name: "poc-nrpc-service",
        cloudMapNamespace: props.cloudMapNamespace,
        failureThreshold: 10
      }
    });

    props.listener.addTargets("poc-nrpc-tg", {
      targetGroupName: "poc-nrpc-tg",
      protocol: elb.ApplicationProtocol.HTTP,
      port: PORT,
      targets: [service]
    });
  }
}

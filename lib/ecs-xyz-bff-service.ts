import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
  cloudMapNamespace: cloudmap.PrivateDnsNamespace;
}

export class EcsXyzBffServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const PORT = 3000;

    const logDriver = new ecs.AwsLogDriver({
      streamPrefix: "poc"
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "poc-xyz-bff-service",
      {
        serviceName: "poc-xyz-bff-service",
        cluster: props.cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 3,
        cloudMapOptions: {
          name: "poc-xyz-bff-service",
          cloudMapNamespace: props.cloudMapNamespace,
          failureThreshold: 10
        },
        taskImageOptions: {
          family: "poc-xyz-bff-task",
          image: ecs.ContainerImage.fromAsset("./containers/xyz-bff"),
          containerName: "poc-xyz-bff-container",
          containerPort: PORT,
          enableLogging: true,
          logDriver: logDriver,
          environment: {
            NODE_ENV: "production"
          }
        },
        publicLoadBalancer: false
      }
    );
  }
}

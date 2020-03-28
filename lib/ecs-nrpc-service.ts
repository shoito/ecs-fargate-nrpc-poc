import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
  listener: elb.ApplicationListener;
}

export class EcsNrpcServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const PORT = 80;

    const logDriver = new ecs.AwsLogDriver({
      streamPrefix: "poc"
    });

    const taskDef = new ecs.FargateTaskDefinition(this, "poc-nrpc-task-def", {
      family: "poc-nrpc-task"
    });

    const container = taskDef.addContainer("poc-nrpc-container", {
      image: ecs.ContainerImage.fromAsset("./containers/nrpc"),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: logDriver
    });

    container.addPortMappings({
      containerPort: PORT,
      hostPort: PORT,
      protocol: ecs.Protocol.TCP
    });

    const sg = new ec2.SecurityGroup(this, "poc-nrpc-service-sg", {
      securityGroupName: "poc-nrpc-service-sg",
      vpc: props.cluster.vpc,
      allowAllOutbound: true
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(PORT));

    const service = new ecs.FargateService(this, "poc-nrpc-service", {
      serviceName: "poc-nrpc-service",
      cluster: props.cluster,
      assignPublicIp: false,
      taskDefinition: taskDef,
      desiredCount: 2,
      securityGroup: sg,
      healthCheckGracePeriod: cdk.Duration.minutes(1),
      deploymentController: { type: ecs.DeploymentControllerType.ECS }
    });

    service.enableCloudMap({
      name: "poc-nrpc-service",
      dnsRecordType: cloudmap.DnsRecordType.A,
      dnsTtl: cdk.Duration.seconds(60)
    });

    props.listener.addTargets("poc-nrpc-tg", {
      targetGroupName: "poc-nrpc-tg",
      protocol: elb.ApplicationProtocol.HTTP,
      port: PORT,
      healthCheck: {
        path: "/health",
        interval: cdk.Duration.seconds(15),
        timeout: cdk.Duration.seconds(10)
      },
      targets: [service]
    });
  }
}

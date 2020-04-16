import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
}

export class EcsXyzBffServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const PORT = 3000;

    const logDriver = new ecs.AwsLogDriver({
      streamPrefix: "poc"
    });

    const taskDef = new ecs.FargateTaskDefinition(
      this,
      "poc-xyz-bff-task-def",
      {
        family: "poc-xyz-bff-task"
      }
    );

    const container = taskDef.addContainer("poc-xyz-bff-container", {
      image: ecs.ContainerImage.fromAsset("./containers/xyz-bff"),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: logDriver,
      environment: {
        NODE_ENV: "production"
      }
    });

    container.addPortMappings({
      containerPort: PORT,
      hostPort: PORT,
      protocol: ecs.Protocol.TCP
    });

    const sg = new ec2.SecurityGroup(this, "poc-xyz-bff-service-sg", {
      securityGroupName: "poc-xyz-bff-service-sg",
      vpc: props.cluster.vpc,
      allowAllOutbound: true
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(PORT));

    const service = new ecs.FargateService(this, "poc-xyz-bff-service", {
      serviceName: "poc-xyz-bff-service",
      cluster: props.cluster,
      platformVersion: ecs.FargatePlatformVersion.LATEST, // FIXME to VERSION1_4
      assignPublicIp: false,
      taskDefinition: taskDef,
      desiredCount: 3,
      securityGroup: sg,
      deploymentController: { type: ecs.DeploymentControllerType.ECS }
    });

    service.enableCloudMap({
      name: "poc-xyz-bff-service",
      dnsRecordType: cloudmap.DnsRecordType.A,
      dnsTtl: cdk.Duration.seconds(60)
    });
  }
}

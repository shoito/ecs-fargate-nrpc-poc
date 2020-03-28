import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class EcsClusterStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;

  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    this.cluster = new ecs.Cluster(this, "poc-cluster", {
      clusterName: "poc-cluster",
      vpc: props.vpc,
      containerInsights: true,
      defaultCloudMapNamespace: {
        name: "poc.internal",
        type: cloudmap.NamespaceType.DNS_PRIVATE
      }
    });
  }
}

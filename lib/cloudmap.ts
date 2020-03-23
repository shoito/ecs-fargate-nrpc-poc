import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as cloudmap from "@aws-cdk/aws-servicediscovery";

export interface ExtendedStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class CloudMapStack extends cdk.Stack {
  public readonly cloudMapNamespace: cloudmap.PrivateDnsNamespace;

  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    this.cloudMapNamespace = new cloudmap.PrivateDnsNamespace(
      this,
      "poc-cloudmap-namespace",
      {
        name: "poc.internal",
        vpc: props.vpc
      }
    );
  }
}

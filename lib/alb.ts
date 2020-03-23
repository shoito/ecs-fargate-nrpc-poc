import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";

export interface ExtendedStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
}

export class AlbStack extends cdk.Stack {
  public readonly listener: elb.ApplicationListener;

  constructor(scope: cdk.App, id: string, props: ExtendedStackProps) {
    super(scope, id, props);

    const alb = new elb.ApplicationLoadBalancer(this, "poc-alb", {
      loadBalancerName: "poc-alb",
      vpc: props.vpc,
      internetFacing: true
    });

    new cdk.CfnOutput(this, "poc-alb-dns", {
      value: alb.loadBalancerDnsName
    });

    this.listener = alb.addListener("poc-listener", { port: 80 });
  }
}

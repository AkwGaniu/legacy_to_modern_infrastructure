import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface Ec2Props extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Ec2Props) {
    super(scope, id, props);

    // EC2 Instance puublic subnet
    const publicInstance = new ec2.Instance(this, 'PublicInstance', {
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
    });
  
    cdk.Tags.of(publicInstance).add('Name', 'PublicInstance');
  }
}

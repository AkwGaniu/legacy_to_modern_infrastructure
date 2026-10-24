import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface DbStackProps extends cdk.StackProps {
  vpc: cdk.aws_ec2.Vpc;
  appSecurityGroup: ec2.ISecurityGroup;
}

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DbStackProps) {
    super(scope, id, props);

    const dbInstance = new rds.DatabaseInstance(this, 'MyDatabase', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_46,
      }),
      instanceType: cdk.aws_ec2.InstanceType.of(
        cdk.aws_ec2.InstanceClass.T3,
        cdk.aws_ec2.InstanceSize.MICRO
      ),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
      },
      multiAz: false,
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      publiclyAccessible: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(1),
    });

    // Allow inbound traffic from the EC2 instance security group to the RDS instance on port 3306 (MySQL)
    dbInstance.connections.allowFrom(props.appSecurityGroup, cdk.aws_ec2.Port.tcp(3306), 'Allow MySQL access from EC2 instance');

    new cdk.CfnOutput(this, 'DbInstanceEndpoint', {
      value: dbInstance.dbInstanceEndpointAddress,
      description: 'The endpoint address of the RDS instance',
    });
  }
}
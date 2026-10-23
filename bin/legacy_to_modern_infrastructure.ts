#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { LegacyToModernInfrastructureStack } from '../lib/legacy_to_modern_infrastructure-stack';
import { Ec2Stack } from '../lib/ec2-stack';
import { DbStack } from '../lib/db-stack';

const app = new cdk.App();
const vpcStack = new LegacyToModernInfrastructureStack(app, 'LegacyToModernInfrastructureStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new Ec2Stack(app, 'Ec2Stack', {
  vpc: vpcStack.vpc,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new DbStack(app, 'DbStack', {
  vpc: vpcStack.vpc,
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
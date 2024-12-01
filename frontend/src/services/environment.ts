export interface Environment {
  production: boolean;
  AWSCognitoIdentity: string;
  AWSCognitoIdentitySMS: string;
  AWSCognitoIdentityEmail: string;
}

export const environment: Environment = {
  production: false,
  AWSCognitoIdentity: "us-east-1:8bb4dddb-b4b8-449f-9b96-b748e4030d91",
  AWSCognitoIdentitySMS: "ap-southeast-1:83708f70-f28f-4087-9d4f-a40350908ea3",
  AWSCognitoIdentityEmail: "us-east-1:8bb4dddb-b4b8-449f-9b96-b748e4030d91",
};

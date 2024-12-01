import { Injectable } from "@angular/core";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { v4 as uuidv4 } from "uuid";
import { environment } from "./environment";

@Injectable({
  providedIn: "root",
})
export class S3serviceService {
  private bucketName = "inf2003bucket";
  private region = "us-east-1";
  private identityPoolId = environment.AWSCognitoIdentity.split("=")[1];

  private s3: S3Client;

  constructor() {
    // Initialize the S3 client with Cognito credentials
    this.s3 = new S3Client({
      region: this.region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: this.region }),
        identityPoolId: this.identityPoolId,
      }),
    });
  }

  // Upload file to S3
  async uploadFile(file: File): Promise<{ fileId: string; location: string }> {
    const fileId = uuidv4(); // Generate a unique file ID

    console.log("upload file");
    console.log(this.identityPoolId);

    // Configure the S3 upload parameters
    let params = {
      Bucket: this.bucketName,
      Key: `${fileId}-${file.name}`, // Use fileId and filename to ensure uniqueness
      Body: file,
      ACL: "public-read" as ObjectCannedACL, // Optional: Make the file publicly accessible
    };

    try {
      // Use the PutObjectCommand to upload the file
      const data = await this.s3.send(new PutObjectCommand(params));

      return {
        fileId: fileId, // Return the generated fileId
        location: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${params.Key}`, // The location of the uploaded file
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

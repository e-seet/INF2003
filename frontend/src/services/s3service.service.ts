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
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable({
  providedIn: "root",
})
export class S3serviceService {
  private bucketName = "inf2003bucket";
  private region = "us-east-1";
  //   private identityPoolId = environment.AWSCognitoIdentity.split("=")[1];
  private identityPoolId = "us-east-1:8bb4dddb-b4b8-449f-9b96-b748e4030d91";
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

  // Generate a signed URL for uploading files to S3
  async getSignedUrl(file: File, fileId: string): Promise<string> {
    const key = `${fileId}-${file.name}`; // Key for the object

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: file.type, // MIME type of the file
      });

      // Generate a signed URL using the presigner
      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 3600,
      }); // URL valid for 1 hour
      console.log("Generated signed URL:", signedUrl);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }

  // Upload file to S3 using the signed URL
  async uploadFile(file: File): Promise<{ fileId: string; location: string }> {
    const fileId = uuidv4(); // Generate a unique file ID
    console.log("fileid");
    console.log(fileId);
    const signedUrl = await this.getSignedUrl(file, fileId);

    try {
      // Upload the file using the signed URL
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type, // Set the correct content type
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file. Status: ${response.status}`);
      }

      console.log("File uploaded successfully");

      const fileId = signedUrl.split("?")[0].split("/").pop(); // Extract file ID from URL
      console.log("file id" + fileId);
      return {
        fileId: fileId || "", // Return the generated fileId
        location: "https://d1ex7sr8l8poxt.cloudfront.net/" + fileId, // Return the location of the uploaded file
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Upload file to S3
  //   async uploadFile(file: File): Promise<{ fileId: string; location: string }> {
  //     const fileId = uuidv4(); // Generate a unique file ID

  //     console.log("upload file");
  //     console.log(this.identityPoolId);

  //     // Configure the S3 upload parameters
  //     let params = {
  //       Bucket: this.bucketName,
  //       Key: `${fileId}-${file.name}`, // Use fileId and filename to ensure uniqueness
  //       Body: file,
  //       ACL: "public-read" as ObjectCannedACL, // Optional: Make the file publicly accessible
  //     };

  //     try {
  //       // Use the PutObjectCommand to upload the file
  //       const data = await this.s3.send(new PutObjectCommand(params));

  //       return {
  //         fileId: fileId, // Return the generated fileId
  //         location: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${params.Key}`, // The location of the uploaded file
  //       };
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //       throw error;
  //     }
  //   }
}

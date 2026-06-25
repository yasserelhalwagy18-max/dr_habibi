import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// Initialize the S3 client
const s3Config: any = {
  region: process.env.S3_REGION || "default", // ArvanCloud or similar might not need a specific region, or use "default"
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
};

if (process.env.S3_ENDPOINT) {
  s3Config.endpoint = process.env.S3_ENDPOINT;
}

const s3Client = new S3Client(s3Config);

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "my-bucket";

/**
 * Uploads a file buffer to S3 and returns the public URL.
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  mimetype: string,
  originalName: string
): Promise<string> {
  // Generate a unique filename to prevent overwrites
  const ext = originalName.split(".").pop();
  const uniqueName = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
  const key = `assessments/${uniqueName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: "public-read", // Make it publicly readable if needed
  });

  await s3Client.send(command);

  // Construct the public URL. For custom endpoints, it usually looks like:
  // https://<endpoint>/<bucket>/<key> or https://<bucket>.<endpoint>/<key>
  // Assuming a standard path-style or virtual-hosted style:
  const endpointUrl = new URL(process.env.S3_ENDPOINT || "https://s3.amazonaws.com");

  // For standard ArvanCloud/Liara, typically the URL is https://<endpoint>/<bucket>/<key> or the endpoint already includes the bucket.
  // We'll use a basic path-style URL for broad compatibility:
  return `${endpointUrl.origin}/${BUCKET_NAME}/${key}`;
}

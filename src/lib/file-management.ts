import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { env } from "~/env.mjs"

export async function getUrlForUpload(filename: string): Promise<string> {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  return await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: env.R2_BUCKET, Key: filename }),
    { expiresIn: 3600 },
  )
}

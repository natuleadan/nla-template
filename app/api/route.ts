import { ApiReference } from "@scalar/nextjs-api-reference"
import { buildOpenApiSpec, getApiExamples } from "@/lib/modules/scalar"

export async function GET() {
  const examples = await getApiExamples()
  const spec = buildOpenApiSpec(examples)
  const config = { content: JSON.stringify(spec) }
  return ApiReference(config)()
}
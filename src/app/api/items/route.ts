// DELETE-ME: example reference route demonstrating a thin GET/POST resource handler.
import { itemService } from '@/server/services/itemService';
import { toSafeErrorResponse } from '@/lib/errors';
import { createItemSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const items = await itemService.listItems();
    return Response.json({ data: items });
  } catch (err) {
    const { status, body } = toSafeErrorResponse(err);
    return Response.json(body, { status });
  }
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createItemSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const item = await itemService.createItem(parsed.data);
    return Response.json({ data: item }, { status: 201 });
  } catch (err) {
    const { status, body } = toSafeErrorResponse(err);
    return Response.json(body, { status });
  }
}

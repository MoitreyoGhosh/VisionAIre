/* eslint-disable camelcase */
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.warn(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error handling webhook event: ${error}`);
    return new Response('Error occurred while processing event', {
      status: 500,
    });
  }

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  return new Response('', { status: 200 });
}

async function handleUserCreated(data: any) {
  const { id, email_addresses, image_url, first_name, last_name, username } = data;

  const user = {
    clerkId: id,
    email: email_addresses[0].email_address,
    username: username!,
    firstName: first_name,
    lastName: last_name,
    photo: image_url,
  };

  const newUser = await createUser(user);

  if (newUser) {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        userId: newUser._id,
      },
    });
  }
}

async function handleUserUpdated(data: any) {
  const { id, image_url, first_name, last_name, username } = data;

  const user = {
    firstName: first_name,
    lastName: last_name,
    username: username!,
    photo: image_url,
  };

  await updateUser(id, user);
}

async function handleUserDeleted(data: any) {
  const { id } = data;
  await deleteUser(id);
}

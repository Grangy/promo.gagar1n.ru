import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST: Create a new event
export async function POST(request: Request) {
  try {
    const { title, date, image } = await request.json();
    const event = await prisma.event.create({
      data: { title, date, image },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT: Update an existing event
export async function PUT(request: Request) {
  try {
    const { id, title, date, image } = await request.json();
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: { title, date, image },
    });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE: Delete an event
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.event.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
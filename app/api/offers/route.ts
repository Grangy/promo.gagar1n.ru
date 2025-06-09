import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all offers
export async function GET() {
  try {
    const offers = await prisma.offer.findMany();
    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

// POST: Create a new offer
export async function POST(request: Request) {
  try {
    const { type, color, image } = await request.json();
    const offer = await prisma.offer.create({
      data: { type, color, image },
    });
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}

// PUT: Update an existing offer
export async function PUT(request: Request) {
  try {
    const { id, type, color, image } = await request.json();
    const offer = await prisma.offer.update({
      where: { id: Number(id) },
      data: { type, color, image },
    });
    return NextResponse.json(offer, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

// DELETE: Delete an offer
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.offer.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Offer deleted' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
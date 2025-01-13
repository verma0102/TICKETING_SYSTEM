import { NextRequest, NextResponse } from 'next/server';
import { Billing } from '@/mongodb/schemas/billingSchema';
import { connectToDatabase } from "@/mongodb";
import { getUserAuth } from '@/lib/dbAuth';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const userAuth = await getUserAuth();
        if (!userAuth) {
            return NextResponse.json(
                { error: 'User authentication failed' },
                { status: 401 }
            );
        }
        await connectToDatabase();
        const { email, date, amount, message, dueDate } = await request.json();
        if (!email || !date || !amount || !message || !dueDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        const { clientReferenceID } = userAuth;
        console.log('userAuth:', userAuth);

        const newBilling = new Billing({
            clientReferenceID,
            email,
            date,
            amount,
            message,
            dueDate,
        });
        await newBilling.save();
        return NextResponse.json(newBilling, { status: 201 });
    } catch (error: any) {
        console.error('Error creating billing:', error);
        return NextResponse.json(
            { error: 'Failed to create billing' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const userAuth = await getUserAuth();
        console.log('userAuth:', userAuth);

        if (!userAuth) {
            return NextResponse.json(
                { error: 'User authentication failed' },
                { status: 401 }
            );
        }
        const email = userAuth.email;
        if (!email) {
            return NextResponse.json(
                { error: 'Authenticated user does not have an email' },
                { status: 400 }
            );
        }
        await connectToDatabase();
        const billings = await Billing.find({ email });
        if (!billings || billings.length === 0) {
            return NextResponse.json(
                { error: 'No billing records found for this email' },
                { status: 404 }
            );
        }
        console.log('billing:', billings);
        return NextResponse.json(billings, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching billing data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch billing data' },
            { status: 500 }
        );
    }
}




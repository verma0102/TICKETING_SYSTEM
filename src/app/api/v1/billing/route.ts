// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/mongodb";
// import { BillingModel } from "@/mongodb/schemas/billingSchema";
// import { getUserAuth } from '@/lib/dbAuth';

// export async function GET(request: NextRequest): Promise<NextResponse> {
//     try {
//         await connectToDatabase();
//         const { searchParams } = new URL(request.url);
//         const id = searchParams.get("id");
//         if (!id) {
//             return NextResponse.json({ error: "Billing ID is required" }, { status: 400 });
//         }
//         const billing = await BillingModel.findById(id);
//         if (!billing) {
//             return NextResponse.json({ error: "Billing not found" }, { status: 404 });
//         }
//         console.log('billingData....:', billing);

//         return NextResponse.json(billing, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching billing:", error);
//         return NextResponse.json({ error: "Failed to fetch billing" }, { status: 500 });
//     }
// }

// export async function POST(request: NextRequest): Promise<NextResponse> {
//     try {
//         const userAuth = await getUserAuth();
//         if (!userAuth) {
//             return NextResponse.json({ error: 'User authentication failed' }, { status: 401 });
//         }
//         await connectToDatabase();
//         const { email, billingHistory } = await request.json();
//         const { clientReferenceID } = userAuth;
//         console.log('userAuth:', userAuth);

//         const newBilling = new BillingModel({
//             clientReferenceID,
//             email,
//             billingHistory: billingHistory || [],
//         });

//         await newBilling.save();

//         console.log('newBilling:', newBilling);
//         return NextResponse.json(newBilling, { status: 201 });
//     } catch (error: any) {
//         console.error("Error creating billing:", error);
//         return NextResponse.json({ error: "Failed to create billing" }, { status: 500 });
//     }
// }

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

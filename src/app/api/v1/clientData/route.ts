import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/mongodb";
import { ClientModel } from "@/mongodb/schemas/NewClientSchema";

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        if (request.method !== "GET") {
            return NextResponse.json(
                { error: `Method ${request.method} Not Allowed` },
                { status: 405, headers: { Allow: "GET" } }
            );
        }
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }
        const client = await ClientModel.findById(id);
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json(client, { status: 200 });
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
    }
}
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        if (request.method !== "POST") {
            return NextResponse.json(
                { error: `Method ${request.method} Not Allowed` },
                { status: 405, headers: { Allow: "POST" } }
            );
        }
        await connectToDatabase();
        const { email, roles, domain, saasProductName, billingHistory } = await request.json();

        if (!email || !roles || !domain || !saasProductName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const newClient = new ClientModel({
            email,
            roles,
            domain,
            saasProductName,
            billingHistory: billingHistory || [],
        });
        await newClient.save();
        console.log('newClient:', newClient);
        return NextResponse.json(newClient, { status: 201 });
    } catch (error: any) {
        console.error("Error creating client:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {}).join(", ");
            return NextResponse.json({ error: `Duplicate value for field(s): ${field}` }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
    }
}

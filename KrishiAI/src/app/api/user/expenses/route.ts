import { NextRequest, NextResponse } from "next/server";
import { getUserExpenses, addUserExpense, deleteUserExpense } from "@/lib/firebaseService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";

    const expenses = await getUserExpenses(uid);
    return NextResponse.json({ success: true, expenses });
  } catch (err: unknown) {
    console.error("[API Expenses GET]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = body.uid || "user-001";
    const { category, amount, date, notes } = body;

    if (!category || typeof amount !== "number") {
      return NextResponse.json({ success: false, error: "Category and valid amount required" }, { status: 400 });
    }

    const added = await addUserExpense(uid, {
      category,
      amount,
      date: date || new Date().toISOString().split("T")[0],
      notes: notes || "",
    });

    return NextResponse.json({ success: true, expense: added });
  } catch (err: unknown) {
    console.error("[API Expenses POST]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || "user-001";
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Expense ID is required" }, { status: 400 });
    }

    await deleteUserExpense(uid, id);
    return NextResponse.json({ success: true, message: "Expense deleted" });
  } catch (err: unknown) {
    console.error("[API Expenses DELETE]", err);
    return NextResponse.json({ success: false, error: (err as Error)?.message }, { status: 500 });
  }
}

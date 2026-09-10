import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch(
      "https://germanlawai-model.pixfar.com/research",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data?.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading file." },
      { status: 500 }
    );
  }
}

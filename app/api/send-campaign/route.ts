import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { title, description, email, target } = await req.json();

    if (!title || !description || !email || !target) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Kindr Campaign" <${process.env.EMAIL_USER}>`,
      to: "bekindrgh@gmail.com",
      subject: "New Campaign Registration",
      html: `
        <h2>New Campaign Created</h2>
        <p><strong>Creator Email:</strong> ${email}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        <p><strong>Target:</strong> Ghc ${Number(target).toLocaleString()}</p>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { EnquirySchema } from '@/lib/validation';
import nodemailer from 'nodemailer';

// GET: Retrieve all enquiries sorted by newest first (Protected by middleware)
export async function GET() {
  try {
    await dbConnect();
    const enquiries = await Enquiry.find({}).sort({ timestamp: -1 });
    return NextResponse.json(enquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit a new enquiry (Public)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Validate input data using Zod schema
    const validationResult = EnquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, phone, company, message, productName, serviceName, categoryName, pageUrl } = validationResult.data;

    // 2. Generate unique enquiry ID
    const enqId = 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);

    // 3. Create document in MongoDB
    const newEnquiry = await Enquiry.create({
      id: enqId,
      name,
      email,
      phone,
      company,
      message,
      productName,
      serviceName,
      categoryName,
      pageUrl,
      timestamp: new Date(),
    });

    // 4. Send email notification via nodemailer
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    const emailHtml = `
      <h2>New Website Enquiry Received</h2>
      <hr />
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Company/Organization:</strong> ${company || 'N/A'}</p>
      <p><strong>Phone Number:</strong> ${phone || 'N/A'}</p>
      <p><strong>Email Address:</strong> ${email}</p>
      <p><strong>Inquiry Details:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #136B36;">
        ${message.replace(/\n/g, '<br />')}
      </blockquote>
      <p><strong>Contextual Information:</strong></p>
      <ul>
        <li>Product Name: ${productName || 'N/A'}</li>
        <li>Service Name: ${serviceName || 'N/A'}</li>
        <li>Category Name: ${categoryName || 'N/A'}</li>
      </ul>
      <p><strong>Source Page URL:</strong> <a href="${pageUrl}">${pageUrl || 'N/A'}</a></p>
      <p><strong>Timestamp:</strong> ${newEnquiry.timestamp}</p>
    `;

    let emailSent = false;
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Sky Life Sciences Solutions" <${smtpUser}>`,
          to: 'shylender@skylifesciencessolutions.com',
          subject: `[New Enquiry] - ${name} from ${company || 'Individual'}`,
          html: emailHtml,
        });
        emailSent = true;
        console.log('Notification email sent successfully to shylender@skylifesciencessolutions.com.');
      } catch (emailErr: any) {
        console.error('Failed to send email notification:', emailErr.message);
      }
    } else {
      console.log('Email logging (No SMTP config found):');
      console.log(emailHtml.replace(/<[^>]+>/g, '\n').trim());
    }

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry,
      emailSent,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove an enquiry by its ID (Protected by middleware)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    const result = await Enquiry.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

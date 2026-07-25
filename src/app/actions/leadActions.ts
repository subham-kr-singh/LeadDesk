'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';
import { leadSchema, LeadFormData } from '@/lib/validations';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createLeadAction(data: LeadFormData) {
  try {
    // 1. Server-side re-validation using Zod
    const validationResult = leadSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Invalid input parameters. Please check the form errors.',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validData = validationResult.data;

    // 2. Insert into Neon database via Drizzle
    const [insertedLead] = await db
      .insert(leads)
      .values({
        name: validData.name,
        email: validData.email.toLowerCase(),
        budgetRange: validData.budgetRange,
        message: validData.message,
        status: 'new',
      })
      .returning();

    revalidatePath('/admin');

    return {
      success: true,
      message: 'Thank you! Your lead has been submitted successfully.',
      leadId: insertedLead.id,
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      error: 'A server error occurred while processing your request. Please try again later.',
    };
  }
}

export async function updateLeadStatusAction(leadId: string, status: 'new' | 'contacted' | 'closed') {
  try {
    // Auth check
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Unauthorized access. Please log in to perform this action.',
      };
    }

    // Validate status parameter
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return {
        success: false,
        error: 'Invalid status specified.',
      };
    }

    // Update in database
    await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, leadId));

    revalidatePath('/admin');

    return {
      success: true,
      message: `Lead status updated to ${status}.`,
    };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return {
      success: false,
      error: 'Failed to update lead status in database.',
    };
  }
}

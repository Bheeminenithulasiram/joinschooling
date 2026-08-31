"use server";
import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";

export type ApplyResult = { ok: true } | { ok: false; error: string };

export async function applyInternshipAction(internshipId: string, coverLetter?: string): Promise<ApplyResult> {
  try {
    await api(`/api/v1/internships/${internshipId}/apply`, {
      method: "POST",
      body: JSON.stringify({ cover_letter: coverLetter ?? "" }),
    });
    revalidatePath("/dashboard");
    revalidatePath("/applications");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e instanceof ApiError ? (e.problem?.title || "Apply failed") : "Apply failed" };
  }
}

export async function saveItemAction(kind: string, targetId: string): Promise<ApplyResult> {
  try {
    await api(`/api/v1/saved`, { method: "POST", body: JSON.stringify({ kind, target_id: targetId }) });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e instanceof ApiError ? (e.problem?.title || "Save failed") : "Save failed" };
  }
}

export type AiFinderInput = {
  tenth_percentage: number;
  twelfth_percentage: number;
  cgpa: number;
  preferred_course: string;
  budget_max_lpa: number;
  state?: string;
  hostel_required?: boolean;
  expected_package_lpa?: number;
  preferred_companies?: string[];
};

export async function runAiFinderAction(input: AiFinderInput) {
  try {
    return { ok: true as const, data: await api(`/api/v1/ai/college-finder`, { method: "POST", body: JSON.stringify(input) }) };
  } catch (e: any) {
    return { ok: false as const, error: e instanceof ApiError ? (e.problem?.title || "AI Finder failed") : "AI Finder failed" };
  }
}

export async function markAllNotificationsReadAction(): Promise<ApplyResult> {
  try {
    await api(`/api/v1/me/notifications/read`, { method: "POST" });
    revalidatePath("/notifications");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e instanceof ApiError ? (e.problem?.title || "Mark read failed") : "Mark read failed" };
  }
}

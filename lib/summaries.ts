import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();
  const summaries =
    await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return summaries;
}

export const getSummaryById = async (summaryId: string) => {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`SELECT
    id,
    user_id,
    title,
    original_file_url,
    summary_text,
    created_at,
    file_name,
    updated_at,
    status,
    LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
    FROM pdf_summaries WHERE id = ${summaryId}`;
    return summary;
  } catch (error) {
    console.error("Failed to get summary by id:", error);
    return null;
  }
};

export async function getUserUploadCount(userId: string) {
  const sql = await getDbConnection();
  const [result] =
    await sql`SELECT COUNT(*) as count FROM pdf_summaries WHERE user_id = ${userId}`;
  return result.count;
}

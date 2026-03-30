import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Menggunakan Service Role Key agar bisa upload tanpa autentikasi user Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "uploads";

/**
 * Upload file ke Supabase Storage
 * @param file - File object dari FormData
 * @param folder - Sub-folder di dalam bucket (misal: "kamar", "bukti-transfer", "hero")
 * @returns URL publik file yang berhasil di-upload, atau null jika gagal
 */
export async function uploadFile(file: File, folder: string): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${folder}/${timestamp}-${randomStr}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error(`Upload ke Supabase Storage gagal [${folder}]:`, error.message);
        return null;
    }

    // Dapatkan URL publik
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
    return data.publicUrl;
}

/**
 * Upload banyak file sekaligus
 * @returns Array URL publik file yang berhasil
 */
export async function uploadMultipleFiles(files: File[], folder: string): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        const url = await uploadFile(file, folder);
        if (url) urls.push(url);
    }
    return urls;
}

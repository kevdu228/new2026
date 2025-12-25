import { redirect } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default async function Page({ params }: { params: { token: string } }) {
  const token = params.token;

  try {
    const { data, error } = await supabase
      .from('shortlinks')
      .select('url')
      .eq('token', token)
      .single();

    if (error) {
      throw error;
    }

    if (data?.url) {
      // server-side redirect
      redirect(data.url);
    }
  } catch (e) {
    // ignore
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-gray-900 rounded text-white">
        <h1 className="text-xl font-bold mb-2">Raccourci introuvable</h1>
        <p>Le raccourci demandé est introuvable ou expiré.</p>
      </div>
    </main>
  );
}
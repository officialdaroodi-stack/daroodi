import { createClient } from '@/lib/supabase/client';
import { ProductQuestion } from '@/lib/types';

export async function getQuestions(productId?: string): Promise<ProductQuestion[]> {
  const supabase = createClient();
  let query = supabase.from('product_questions').select('*').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ProductQuestion[];
}

export async function addQuestion(
  question: Omit<ProductQuestion, 'id' | 'created_at' | 'is_answered' | 'answer'>
): Promise<ProductQuestion> {
  const supabase = createClient();
  const newQ: ProductQuestion = {
    ...question,
    id: `qna-${Date.now()}`,
    is_answered: false,
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('product_questions').insert(newQ as any);
  if (error) throw error;
  return newQ;
}

export async function answerQuestion(questionId: string, answerText: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('product_questions')
    .update({ answer: answerText, is_answered: true })
    .eq('id', questionId);
  if (error) throw error;
}

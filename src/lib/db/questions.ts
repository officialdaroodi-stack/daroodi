import { supabase } from '@/lib/supabase/client';
import { ProductQuestion } from '@/lib/types';

const QUESTIONS_STORAGE_KEY = 'daroodi_db_questions';

const INITIAL_QUESTIONS: ProductQuestion[] = [
  {
    id: 'qna-1',
    product_id: 'prod-imperial-emerald-prince-coat',
    user_name: 'Farooq Siddiqui',
    user_email: 'f.siddiqui@gmail.com',
    question: 'How long does bespoke tailoring take for an overseas wedding in the United States?',
    answer: 'Standard bespoke production requires 3 to 4 weeks because each motif is hand-embroidered by master zardozi artisans. For urgent wedding dates, our atelier offers a 14-day rush courier service via DHL Express. Contact our WhatsApp Master Stylist to schedule rush delivery.',
    is_answered: true,
    created_at: '2026-07-20T11:00:00Z',
  },
  {
    id: 'qna-2',
    product_id: 'prod-imperial-emerald-prince-coat',
    user_name: 'Zain Malik',
    user_email: 'zain.malik@outlook.com',
    question: 'Is internal seam allowance provided if I need slight adjustments locally?',
    answer: 'Yes, absolutely. Every Daroodi prince coat and sherwani includes a generous 2.5-inch internal silk seam allowance along the sides and sleeves, allowing effortless local tailoring if your weight fluctuates.',
    is_answered: true,
    created_at: '2026-07-25T15:20:00Z',
  },
  {
    id: 'qna-3',
    product_id: 'prod-royal-midnight-velvet-coat',
    user_name: 'Naveed Akhtar',
    user_email: 'naveed.akhtar@yahoo.com',
    question: 'Can I order a matching custom raw silk kurta and embroidered churidar with this coat?',
    answer: 'Yes! You can choose our 2-Piece Ensemble or 3-Piece Imperial Wedding Bundle directly from the Pack Options selector on this page. We dye the inner silk kurta to harmonize flawlessly with the coat embroidery.',
    is_answered: true,
    created_at: '2026-08-02T13:40:00Z',
  },
];

export async function getQuestions(productId?: string): Promise<ProductQuestion[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(QUESTIONS_STORAGE_KEY);
      let allQuestions = stored ? JSON.parse(stored) : INITIAL_QUESTIONS;
      if (productId) {
        return allQuestions.filter((q: ProductQuestion) => q.product_id === productId || q.product_id.includes(productId) || productId.includes(q.product_id));
      }
      return allQuestions;
    }

    const { data } = await supabase.from('product_questions').select('*');
    if (data && data.length > 0) {
      if (productId) {
        return data.filter((q) => q.product_id === productId) as ProductQuestion[];
      }
      return data as ProductQuestion[];
    }
    return productId ? INITIAL_QUESTIONS.filter((q) => q.product_id === productId) : INITIAL_QUESTIONS;
  } catch {
    return productId ? INITIAL_QUESTIONS.filter((q) => q.product_id === productId) : INITIAL_QUESTIONS;
  }
}

export async function addQuestion(question: Omit<ProductQuestion, 'id' | 'created_at' | 'is_answered' | 'answer'>): Promise<ProductQuestion> {
  const newQ: ProductQuestion = {
    ...question,
    id: `qna-${Date.now()}`,
    is_answered: false,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('product_questions').insert(newQ);
  } catch {
    // Fallback
  }

  if (typeof window !== 'undefined') {
    const existing = await getQuestions();
    const updated = [newQ, ...existing];
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updated));
  }

  return newQ;
}

export async function answerQuestion(questionId: string, answerText: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const existing = await getQuestions();
    const updated = existing.map((q) => (q.id === questionId ? { ...q, answer: answerText, is_answered: true } : q));
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updated));
  }
}

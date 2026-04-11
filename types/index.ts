export type Plan = 'free' | 'credit' | 'b2b_basic' | 'b2b_team' | 'admin';

export type LetterType =
  | 'kuasa'
  | 'surat_jual'
  | 'kuasa_istimewa'
  | 'perj_kerja'
  | 'perj_sewa'
  | 'perj_utang';

export interface User {
  id: string;
  email: string;
  credits: number;
  plan: Plan;
  org_id: string | null;
  created_at: string;
  last_active: string;
  updated_at: string;
}

export interface Letter {
  id: string;
  user_id: string;
  type: LetterType;
  subtype_id: string;
  content: string;
  input_data: Record<string, unknown>;
  api_tokens_used: number;
  pdf_downloaded: boolean;
  flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'purchase' | 'debit' | 'refund' | 'grant';
  credits_delta: number;
  amount_idr: number | null;
  midtrans_order_id: string | null;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'basic' | 'enterprise';
  max_seats: 3 | 10;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  type: string;
  subtype_id: string;
  name_id: string;
  name_en: string | null;
  required_fields: Record<string, unknown>;
  prompt_template: string;
  requires_materai: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  category: 'payment' | 'letter_quality' | 'account' | 'bug' | 'legal' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  related_letter_id: string | null;
  related_transaction_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}
